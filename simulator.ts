/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-performance 4-Qubit Parameterized Quantum Circuit (PQC) 
 * & Variational Quantum Classifier (VQC) Simulator in TypeScript.
 */

export interface Complex {
  real: number;
  imag: number;
}

export class QuantumSimulator {
  // 4 qubits => 2^4 = 16 state amplitudes
  private numQubits: number;
  private state: Complex[];

  constructor(numQubits: number = 4) {
    this.numQubits = numQubits;
    this.state = this.initializeState();
  }

  private initializeState(): Complex[] {
    const size = Math.pow(2, this.numQubits);
    const state = new Array<Complex>(size);
    // Initialize to |0000>
    state[0] = { real: 1, imag: 0 };
    for (let i = 1; i < size; i++) {
      state[i] = { real: 0, imag: 0 };
    }
    return state;
  }

  public getStatevector(): Complex[] {
    return [...this.state];
  }

  /**
   * Encodes 4 normalized classical features into the quantum state
   * using Angle Encoding (RY gates on each qubit).
   */
  public encodeFeatures(features: number[]): void {
    this.state = this.initializeState();
    
    // Apply Hadamard to all qubits first to create superposition
    for (let q = 0; q < this.numQubits; q++) {
      this.applyHadamard(q);
    }

    // Apply parameterized RY rotation based on features
    for (let q = 0; q < this.numQubits; q++) {
      const angle = (features[q] || 0) * Math.PI; // Map to [0, PI]
      this.applyRy(q, angle);
    }
  }

  /**
   * Applies the Variational Circuit layer with parameter weights.
   * Entangles qubits and applies parameterized rotations.
   */
  public applyVariationalLayer(weights: number[]): void {
    // Entanglement Layer (Circular CNOTs)
    for (let q = 0; q < this.numQubits; q++) {
      this.applyCNOT(q, (q + 1) % this.numQubits);
    }

    // Rotation Layer (RY rotations on each qubit with weights)
    for (let q = 0; q < this.numQubits; q++) {
      this.applyRy(q, weights[q]);
    }
  }

  /**
   * Calculates the probabilities of measuring each of the 16 state outcomes.
   */
  public getProbabilities(): number[] {
    return this.state.map(c => c.real * c.real + c.imag * c.imag);
  }

  /**
   * Measure expectations on output states to map to class predictions.
   * We aggregate the 16 states into 4 species classes:
   * Class 0 (Beluga Sturgeon): state 0, 1, 2, 3
   * Class 1 (Whale Shark): state 4, 5, 6, 7
   * Class 2 (Coelacanth): state 8, 9, 10, 11
   * Class 3 (Atlantic Bluefin Tuna): state 12, 13, 14, 15
   */
  public classify(): number[] {
    const probs = this.getProbabilities();
    const classes = [0, 0, 0, 0];
    
    for (let i = 0; i < probs.length; i++) {
      const classIdx = Math.floor(i / 4) % 4;
      classes[classIdx] += probs[i];
    }

    // Softmax normalization to return valid confidence bars
    const exps = classes.map(v => Math.exp(v * 3)); // temperature scale to highlight predictions
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sumExps);
  }

  // --- Quantum Gate Operations ---

  private applyHadamard(target: number): void {
    const size = this.state.length;
    const nextState = this.state.map(c => ({ ...c }));
    const mask = 1 << target;
    const invSqrt2 = 1 / Math.sqrt(2);

    for (let i = 0; i < size; i++) {
      if ((i & mask) === 0) {
        const j = i | mask;
        const psi_0 = this.state[i];
        const psi_1 = this.state[j];

        // H |0> = (|0> + |1>)/sqrt(2), H |1> = (|0> - |1>)/sqrt(2)
        nextState[i] = {
          real: (psi_0.real + psi_1.real) * invSqrt2,
          imag: (psi_0.imag + psi_1.imag) * invSqrt2,
        };
        nextState[j] = {
          real: (psi_0.real - psi_1.real) * invSqrt2,
          imag: (psi_0.imag - psi_1.imag) * invSqrt2,
        };
      }
    }
    this.state = nextState;
  }

  private applyRy(target: number, theta: number): void {
    const size = this.state.length;
    const nextState = this.state.map(c => ({ ...c }));
    const mask = 1 << target;
    const cosVal = Math.cos(theta / 2);
    const sinVal = Math.sin(theta / 2);

    for (let i = 0; i < size; i++) {
      if ((i & mask) === 0) {
        const j = i | mask;
        const psi_0 = this.state[i];
        const psi_1 = this.state[j];

        // Ry(theta) = [[cos(t/2), -sin(t/2)], [sin(t/2), cos(t/2)]]
        nextState[i] = {
          real: psi_0.real * cosVal - psi_1.real * sinVal,
          imag: psi_0.imag * cosVal - psi_1.imag * sinVal,
        };
        nextState[j] = {
          real: psi_0.real * sinVal + psi_1.real * cosVal,
          imag: psi_0.imag * sinVal + psi_1.imag * cosVal,
        };
      }
    }
    this.state = nextState;
  }

  private applyCNOT(control: number, target: number): void {
    const size = this.state.length;
    const nextState = this.state.map(c => ({ ...c }));
    const ctrlMask = 1 << control;
    const tgtMask = 1 << target;

    for (let i = 0; i < size; i++) {
      // If control bit is 1, flip target bit
      if ((i & ctrlMask) !== 0) {
        const counterpart = i ^ tgtMask;
        nextState[counterpart] = this.state[i];
      }
    }
    this.state = nextState;
  }
}

/**
 * Variational Quantum Classifier optimizer (Simulated SPSA/Gradient Descent)
 * Finds the weights that minimize the cross-entropy classification error.
 */
export class VQCOptimizer {
  public weights: number[];
  private lr: number = 0.1;

  constructor(numWeights: number = 4) {
    // Initialize random weights
    this.weights = Array.from({ length: numWeights }, () => Math.random() * Math.PI);
  }

  /**
   * Runs a single optimization step given target features and the target class index.
   * Returns current classification loss and predictions.
   */
  public step(features: number[], targetClass: number): { loss: number; predictions: number[] } {
    const sim = new QuantumSimulator();
    
    // Evaluate function
    const evaluate = (w: number[]): { loss: number; probs: number[] } => {
      sim.encodeFeatures(features);
      sim.applyVariationalLayer(w);
      const preds = sim.classify();
      
      // Categorical Cross-Entropy Loss
      const loss = -Math.log(Math.max(preds[targetClass], 1e-15));
      return { loss, probs: preds };
    };

    const current = evaluate(this.weights);
    
    // Gradient Approximation via Finite Difference (SPSA styled)
    const delta = 0.05;
    const gradients = new Array<number>(this.weights.length);
    
    for (let i = 0; i < this.weights.length; i++) {
      const wPlus = [...this.weights];
      wPlus[i] += delta;
      const resPlus = evaluate(wPlus);

      const wMinus = [...this.weights];
      wMinus[i] -= delta;
      const resMinus = evaluate(wMinus);

      gradients[i] = (resPlus.loss - resMinus.loss) / (2 * delta);
    }

    // Update weights with gradient descent
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] -= this.lr * gradients[i];
      // Keep angles within [-2PI, 2PI]
      this.weights[i] = this.weights[i] % (2 * Math.PI);
    }

    return {
      loss: current.loss,
      predictions: current.probs
    };
  }
}
