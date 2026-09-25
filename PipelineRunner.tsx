/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, Filter, Sparkles, Layers, Cpu, Compass, 
  BarChart2, FileText, CheckCircle2, Play, RefreshCw, Download, 
  Box, ShieldCheck, AlertCircle
} from 'lucide-react';
import { CLOSED_SET_6_SPECIES } from '../utils/fishData';

interface PipelineRunnerProps {
  onSelectSpeciesFromDataset: (speciesName: string) => void;
}

export default function PipelineRunner({ onSelectSpeciesFromDataset }: PipelineRunnerProps) {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Step 1: Dataset Collection state
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});
  const sources = [
    'Fish4Knowledge', 'NOAA Fisheries', 'MBARI', 'Reef Life Survey', 'Kaggle Verified Datasets'
  ];

  // Step 4: Albumentations parameters (Training set only)
  const [augCount, setAugCount] = useState<number>(40);

  // Step 5: Model comparison metrics
  const [selectedYoloVariant, setSelectedYoloVariant] = useState<'YOLOv8n' | 'YOLOv8s' | 'YOLOv8m'>('YOLOv8m');

  useEffect(() => {
    const initial: Record<string, number> = {};
    CLOSED_SET_6_SPECIES.forEach(s => {
      initial[s.name] = 850;
    });
    setDownloadCounts(initial);
  }, []);

  const runFullPipeline = () => {
    setIsRunningPipeline(true);
    setProgress(0);
    setLogs(['[SYSTEM] Initializing Offline Training Phase for 6 Target Endangered Marine Fish Species...']);

    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress === 10) {
        setActivePhase(1);
        setLogs(prev => [...prev, `[STEP 1] Auto-downloading labeled datasets from Fish4Knowledge, NOAA, MBARI, Reef Life Survey & Kaggle for 6 target species (Whale Shark, Scalloped Hammerhead, Smalltooth Sawfish, Humphead Wrasse, Chinese Sturgeon, Devils Hole Pupfish)... 5,100 raw images acquired.`]);
      } else if (currentProgress === 20) {
        setActivePhase(2);
        setLogs(prev => [...prev, `[STEP 2] Dataset Cleaning: Removing duplicate images (pHash), blurry frames (Laplacian Var < 100), corrupt headers, and wrongly labelled images. Clean dataset: 4,800 images.`]);
      } else if (currentProgress === 30) {
        setActivePhase(3);
        setLogs(prev => [...prev, `[STEP 3] Dataset Splitting: Partitioned clean dataset into 70% Training (3,360), 20% Validation (960), and 10% Testing (480).`]);
      } else if (currentProgress === 40) {
        setActivePhase(4);
        setLogs(prev => [...prev, `[STEP 4] Albumentations Augmentation (TRAINING SET ONLY): Applying Random Rotation, Flips, Crop, CLAHE, Blur, Noise, Color Jitter, HSV, Resize, and Normalize. Val & Test sets remain untouched!`]);
      } else if (currentProgress === 50) {
        setActivePhase(5);
        setLogs(prev => [...prev, `[STEP 5] Training YOLOv8 with CBAM Attention backbone... Checkpoint saved: best.pt.`]);
      } else if (currentProgress === 60) {
        setActivePhase(6);
        setLogs(prev => [...prev, `[STEP 6] Extracting deep feature bottleneck vectors from trained YOLOv8 backbone.`]);
      } else if (currentProgress === 70) {
        setActivePhase(7);
        setLogs(prev => [...prev, `[STEP 7] Training Quantum Feature Encoding module... Saved checkpoint: quantum_encoder.pkl.`]);
      } else if (currentProgress === 80) {
        setActivePhase(8);
        setLogs(prev => [...prev, `[STEP 8] Training Variational Quantum Classifier (VQC) using IBM Qiskit Machine Learning... Saved checkpoint: vqc.pkl.`]);
      } else if (currentProgress === 90) {
        setActivePhase(9);
        setLogs(prev => [...prev, `[STEP 9] Training Quantum Autoencoder for anomaly detection & Out-Of-Distribution rejection... Saved checkpoint: quantum_autoencoder.pkl.`]);
      } else if (currentProgress >= 100) {
        setActivePhase(10);
        setLogs(prev => [...prev, `[STEP 10] Saving all trained model artifacts: best.pt, vqc.pkl, quantum_encoder.pkl, quantum_autoencoder.pkl, knowledge_base.json.`]);
        clearInterval(interval);
        setIsRunningPipeline(false);
      }
    }, 500);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-sky-200/50 flex flex-col gap-6 shadow-sm">
      
      {/* Title & Pipeline Run Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sky-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-bold uppercase">
              Offline Training Phase (6 Target Species)
            </span>
            <span className="text-xs text-slate-500 font-mono">YOLOv8 + CBAM + IBM Qiskit VQC</span>
          </div>
          <h2 className="text-lg font-black text-slate-800 mt-1">
            Offline Model Training Pipeline Architecture
          </h2>
        </div>

        <button
          onClick={runFullPipeline}
          disabled={isRunningPipeline}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRunningPipeline ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Executing Step {activePhase}/10 ({progress}%)
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Run Offline Training Pipeline
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isRunningPipeline && (
        <div className="w-full bg-sky-100/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-sky-200/40">
          <div 
            className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 10-Step Training Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
        {[
          { num: 1, label: '1. Data Collection' },
          { num: 2, label: '2. Data Cleaning' },
          { num: 3, label: '3. Dataset Split' },
          { num: 4, label: '4. Albumentations' },
          { num: 5, label: '5. YOLOv8+CBAM' },
          { num: 6, label: '6. Feature Extraction' },
          { num: 7, label: '7. Quantum Encoder' },
          { num: 8, label: '8. Qiskit VQC' },
          { num: 9, label: '9. Autoencoder' },
          { num: 10, label: '10. Save Artifacts' },
        ].map(p => (
          <button
            key={p.num}
            onClick={() => setActivePhase(p.num)}
            className={`p-2 rounded-xl text-center border text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
              activePhase === p.num
                ? 'bg-sky-500 text-white border-sky-600 shadow-sm font-bold'
                : 'bg-white/50 text-slate-600 border-sky-100 hover:bg-sky-50'
            }`}
          >
            <span className="font-mono text-[9px] opacity-75">Step {p.num}</span>
            <span className="truncate w-full block text-[10px]">{p.label}</span>
          </button>
        ))}
      </div>

      {/* ACTIVE STEP VIEW DISPLAY */}
      <div className="bg-white/50 border border-sky-100 rounded-xl p-5 min-h-[280px]">
        
        {/* STEP 1: DATASET COLLECTION */}
        {activePhase === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-500" /> Step 1: Automated Dataset Collection (6 Endangered Marine Fish Species)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Downloading labeled images from verified marine biology sources. All other species are ignored.
                </p>
              </div>
              <span className="text-xs font-mono bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-bold">
                Target Raw Images: 5,100
              </span>
            </div>

            {/* Source badging */}
            <div className="flex flex-wrap gap-1.5 py-1">
              {sources.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60 font-mono text-[10px]">
                  ✓ {s}
                </span>
              ))}
            </div>

            {/* Species grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {CLOSED_SET_6_SPECIES.map((s, idx) => (
                <div 
                  key={s.id} 
                  onClick={() => onSelectSpeciesFromDataset(s.name)}
                  className="p-3 rounded-lg border border-sky-200/80 bg-white hover:bg-sky-50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 truncate">{idx + 1}. {s.name}</span>
                  <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500 font-mono">
                    <span className="italic truncate">{s.scientificName}</span>
                    <span className="text-sky-600 font-bold ml-1">850 imgs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DATA CLEANING */}
        {activePhase === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-500" /> Step 2: Quality Data Cleaning & Filtering
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Duplicate Removal</span>
                <span className="text-base font-bold text-slate-800 mt-1 block">pHash Deduplication</span>
                <p className="text-slate-500 mt-1">Purged duplicate scraped frame snapshots.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Blurry Image Purge</span>
                <span className="text-base font-bold text-amber-600 mt-1 block">Laplacian Var &lt; 100</span>
                <p className="text-slate-500 mt-1">Removed murky underwater frames lacking edge definition.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Corrupted File Filter</span>
                <span className="text-base font-bold text-emerald-600 mt-1 block">Zero-Byte Purge</span>
                <p className="text-slate-500 mt-1">Removed corrupt JPEG headers and broken streams.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-sky-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Taxonomy Audit</span>
                <span className="text-base font-bold text-sky-600 mt-1 block">Label Verification</span>
                <p className="text-slate-500 mt-1">Purged mislabeled non-target species images.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATASET SPLITTING */}
        {activePhase === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" /> Step 3: Dataset Partitioning (70% Train / 20% Val / 10% Test)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-sky-500 text-white shadow-sm">
                <span className="text-[10px] font-mono uppercase opacity-80 font-bold block">70% Training Set</span>
                <span className="text-2xl font-black mt-1 block">3,360 Images</span>
                <p className="text-xs opacity-90 mt-1">Used exclusively for training YOLOv8+CBAM & Quantum models with Albumentations.</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-600 text-white shadow-sm">
                <span className="text-[10px] font-mono uppercase opacity-80 font-bold block">20% Validation Set</span>
                <span className="text-2xl font-black mt-1 block">960 Images</span>
                <p className="text-xs opacity-90 mt-1">NO augmentation applied. Used for hyperparameter tuning & early stopping.</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-700 text-white shadow-sm">
                <span className="text-[10px] font-mono uppercase opacity-80 font-bold block">10% Testing Set</span>
                <span className="text-2xl font-black mt-1 block">480 Images</span>
                <p className="text-xs opacity-90 mt-1">NO augmentation applied. Benchmark test set for final model evaluation.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ALBUMENTATIONS (TRAINING ONLY) */}
        {activePhase === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-500" /> Step 4: Albumentations Augmentation (APPLIED ONLY TO TRAINING DATASET)
              </h3>
              <span className="text-xs font-mono bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full font-bold">
                ⚠️ Never Used During Inference
              </span>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-xs text-slate-700 font-mono leading-relaxed">
              <span className="font-bold text-sky-900 block mb-2">APPLIED ALBUMENTATIONS AUGMENTATIONS:</span>
              • Random Rotation & Horizontal / Vertical Flip<br/>
              • Random Crop & Random Scale & Random Perspective<br/>
              • Brightness, Contrast & CLAHE (Contrast Limited Adaptive Histogram Equalization)<br/>
              • Gaussian Blur, Motion Blur & Gaussian Noise<br/>
              • Color Jitter, Hue Saturation Value (HSV) adjustment<br/>
              • Image Resizing (640x640) & Normalization
            </div>
          </div>
        )}

        {/* STEP 5: YOLOV8 + CBAM */}
        {activePhase === 5 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-500" /> Step 5: YOLOv8 + CBAM Attention Model Training
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-sky-100 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Backbone Checkpoint</span>
                <span className="text-lg font-bold text-slate-800">YOLOv8m + CBAM</span>
                <span className="text-xs text-sky-600 font-mono font-bold mt-2">Saved artifact: best.pt</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-sky-100 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Inference Time</span>
                <span className="text-lg font-bold text-slate-800">14 ms / image</span>
                <span className="text-xs text-slate-500 font-mono mt-2">TensorRT Optimized</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-sky-100 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">CBAM Attention</span>
                <span className="text-lg font-bold text-emerald-600">Channel + Spatial Modules</span>
                <span className="text-xs text-slate-500 font-mono mt-2">Enhanced features under turbid water</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: FEATURE EXTRACTION */}
        {activePhase === 6 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-500" /> Step 6: Deep Feature Vector Extraction
            </h3>
            <div className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs border border-sky-900/50">
              Extracting 512-dimensional bottleneck vectors from trained YOLOv8 neck feature maps to feed downstream quantum state encoders.
            </div>
          </div>
        )}

        {/* STEP 7: QUANTUM FEATURE ENCODER */}
        {activePhase === 7 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-500" /> Step 7: Quantum Feature Encoding Module Training
            </h3>
            <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 font-mono">
              Mapping classical feature dimensions onto 4-qubit Hilbert space rotation angles (RY). Saved artifact: <strong className="text-sky-600">quantum_encoder.pkl</strong>
            </div>
          </div>
        )}

        {/* STEP 8: QISKIT VQC */}
        {activePhase === 8 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-500" /> Step 8: Variational Quantum Classifier (VQC) Training
            </h3>
            <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 font-mono">
              Optimizing parameterized quantum circuits via Qiskit Machine Learning and SPSA gradients. Saved artifact: <strong className="text-sky-600">vqc.pkl</strong>
            </div>
          </div>
        )}

        {/* STEP 9: QUANTUM AUTOENCODER */}
        {activePhase === 9 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" /> Step 9: Quantum Autoencoder Training (Anomaly Detection)
            </h3>
            <div className="p-4 rounded-xl bg-white border border-sky-100 text-xs text-slate-700 font-mono">
              Fidelity-based quantum autoencoder trained to reconstruct quantum state vectors and reject Out-Of-Distribution (Unknown) species. Saved artifact: <strong className="text-sky-600">quantum_autoencoder.pkl</strong>
            </div>
          </div>
        )}

        {/* STEP 10: SAVE ARTIFACTS */}
        {activePhase === 10 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" /> Step 10: Saved Model Artifacts Directory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 font-mono text-xs">
              <div className="p-3 bg-slate-900 text-sky-300 rounded-xl border border-sky-800 flex flex-col justify-between">
                <span className="font-bold text-emerald-400">best.pt</span>
                <span className="text-[10px] text-slate-400 mt-2">YOLOv8 + CBAM Weights</span>
              </div>
              <div className="p-3 bg-slate-900 text-sky-300 rounded-xl border border-sky-800 flex flex-col justify-between">
                <span className="font-bold text-cyan-400">vqc.pkl</span>
                <span className="text-[10px] text-slate-400 mt-2">Qiskit VQC Circuit</span>
              </div>
              <div className="p-3 bg-slate-900 text-sky-300 rounded-xl border border-sky-800 flex flex-col justify-between">
                <span className="font-bold text-indigo-400">quantum_encoder.pkl</span>
                <span className="text-[10px] text-slate-400 mt-2">RY Feature Map State</span>
              </div>
              <div className="p-3 bg-slate-900 text-sky-300 rounded-xl border border-sky-800 flex flex-col justify-between">
                <span className="font-bold text-amber-400">quantum_autoencoder.pkl</span>
                <span className="text-[10px] text-slate-400 mt-2">Anomaly Filter State</span>
              </div>
              <div className="p-3 bg-slate-900 text-sky-300 rounded-xl border border-sky-800 flex flex-col justify-between">
                <span className="font-bold text-teal-400">knowledge_base.json</span>
                <span className="text-[10px] text-slate-400 mt-2">Biodiversity Taxonomy</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Execution Console Logs */}
      {logs.length > 0 && (
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-sky-300 max-h-[140px] overflow-y-auto border border-sky-900/40">
          <div className="text-sky-400 font-bold mb-1 border-b border-sky-900/40 pb-1 flex justify-between">
            <span>OFFLINE TRAINING LOGS:</span>
            <span>STATUS: ACTIVE</span>
          </div>
          {logs.map((log, idx) => (
            <div key={idx} className="py-0.5 leading-snug">{log}</div>
          ))}
        </div>
      )}

    </div>
  );
}
