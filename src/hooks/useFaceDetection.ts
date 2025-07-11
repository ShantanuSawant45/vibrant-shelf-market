import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceExpression {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  [key: string]: number;
}

export interface FaceDetectionResult {
  expressions: FaceExpression;
  dominantEmotion: string;
  confidenceScore: number;
}

export const useFaceDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Try multiple CDN sources for better reliability
        const modelSources = [
          'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model',
          'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights',
          'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights'
        ];

        let loaded = false;
        
        for (const MODEL_URL of modelSources) {
          try {
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
              faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
              faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]);
            
            console.log(`Face-API models loaded successfully from: ${MODEL_URL}`);
            loaded = true;
            break;
          } catch (sourceErr) {
            console.warn(`Failed to load from ${MODEL_URL}:`, sourceErr);
            continue;
          }
        }
        
        if (loaded) {
          setIsModelLoaded(true);
        } else {
          throw new Error('All model sources failed');
        }
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face detection models. Please check your internet connection.');
      }
    };

    loadModels();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user',
          frameRate: { ideal: 30 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          // Start continuous detection when video is ready
          startContinuousDetection();
        };
        streamRef.current = stream;
      }
      setIsDetecting(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied');
    }
  };

  // Stop webcam
  const stopCamera = () => {
    setIsDetecting(false);
    
    // Stop continuous detection
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start continuous face detection
  const startContinuousDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      detectExpressions();
    }, 500); // Detect every 500ms for more responsive updates
  };
  // Detect face expressions with real face-api.js
  const detectExpressions = async () => {
    if (!isModelLoaded || !videoRef.current) return;

    setError(null);

    try {
      // Use more sensitive detection options for better accuracy
      const detectionOptions = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.3
      });

      // Detect faces with expressions
      const detections = await faceapi
        .detectAllFaces(videoRef.current, detectionOptions)
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        // Get the largest face (most confident detection)
        const detection = detections.reduce((prev, current) => 
          prev.detection.score > current.detection.score ? prev : current
        );

        const rawExpressions = detection.expressions;
        
        // Map face-api expressions to our interface
        const expressions: FaceExpression = {
          neutral: rawExpressions.neutral,
          happy: rawExpressions.happy,
          sad: rawExpressions.sad,
          angry: rawExpressions.angry,
          fearful: rawExpressions.fearful,
          disgusted: rawExpressions.disgusted,
          surprised: rawExpressions.surprised
        };
        
        // Find dominant emotion with higher confidence threshold
        const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
          expressions[a as keyof FaceExpression] > expressions[b as keyof FaceExpression] ? a : b
        );
        
        const confidenceScore = expressions[dominantEmotion as keyof FaceExpression];

        // Only update if we have reasonable confidence (>0.3)
        if (confidenceScore > 0.3) {
          setFaceResult({
            expressions,
            dominantEmotion,
            confidenceScore
          });
        }
      } else {
        // No face detected
        setFaceResult(null);
      }
    } catch (err) {
      console.error('Error detecting expressions:', err);
      setError('Failed to detect expressions. Please ensure your face is clearly visible.');
    }
  };

  return {
    videoRef,
    isModelLoaded,
    isDetecting,
    faceResult,
    error,
    startCamera,
    stopCamera,
    detectExpressions
  };
};
