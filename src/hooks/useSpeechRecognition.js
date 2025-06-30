import { useState, useRef, useEffect } from 'https://esm.sh/react@18.2.0';

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const recognitionRef = useRef(null);
  const stopRecordingRef = useRef(false);
  const lastResultsRef = useRef(new Array(100));

  const initializeSpeechRecognition = () => {
    let SpeechRecognition = window.SpeechRecognition || 
                           window.webkitSpeechRecognition || 
                           window.mozSpeechRecognition || 
                           window.msSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimCombined = "";

      Array.from(event.results).forEach((result) => {
        const transcript = result[0].transcript.trim();

        if (result.isFinal) {
          // Deduplicate final transcripts
          if (!lastResultsRef.current.includes(transcript)) {
            setTranscripts(prev => [...prev, { text: transcript, isFinal: true }]);
            lastResultsRef.current.push(transcript);
            lastResultsRef.current.shift();
          }
        } else {
          interimCombined += transcript + " ";
        }
      });

      interimCombined = interimCombined.trim();
      if (interimCombined) {
        // Push a single aggregated interim result (isFinal: false)
        setTranscripts(prev => {
          // Avoid spamming identical interim results
          if (prev.length && !prev[prev.length - 1].isFinal && prev[prev.length - 1].text === interimCombined) {
            return prev;
          }
          return [...prev, { text: interimCombined, isFinal: false }];
        });
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setIsRecording(false);
        setIsInitialized(false);
      }
    };

    recognition.onend = () => {
      if (stopRecordingRef.current) {
        setIsRecording(false);
        return;
      }
      try {
        recognition.start();
      } catch (error) {
        console.error("Error restarting recognition:", error);
        setIsRecording(false);
        setIsInitialized(false);
      }
    };

    return recognition;
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsInitialized(true);
        stopRecordingRef.current = false;
      } catch (error) {
        console.error("Error starting recognition:", error);
        setIsRecording(false);
        setIsInitialized(false);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      stopRecordingRef.current = true;
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recognition on cleanup:", error);
        }
      }
    };
  }, []);

  return {
    isRecording,
    isInitialized,
    transcripts,
    startRecording,
    stopRecording,
    setTranscripts
  };
}; 