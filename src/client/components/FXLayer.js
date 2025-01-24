import React, { useEffect, useRef } from 'react';

const FXLayer = ({ effects }) => {
  const canvasRef = useRef(null);
  let gl = null;
  let animationFrameId = null;

  // Shader source code
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
      gl_Position = vec4(a_position, 0, 1);
      v_texCoord = a_texCoord;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform vec3 u_color;
    uniform float u_time;
    
    void main() {
      float alpha = sin(u_time + v_texCoord.x * 10.0) * 0.5 + 0.5;
      gl_FragColor = vec4(u_color, alpha);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Initialize shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Set up attributes and uniforms
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Animation loop
    let startTime = performance.now();
    const render = () => {
      const currentTime = (performance.now() - startTime) / 1000;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.useProgram(program);
      gl.uniform1f(timeUniformLocation, currentTime);
      
      effects.forEach(effect => {
        drawEffect(effect, program, colorUniformLocation);
      });
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [effects]);

  // Helper functions
  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
  };

  const drawEffect = (effect, program, colorUniformLocation) => {
    const { position, color } = effect;
    gl.uniform3fv(colorUniformLocation, color);
    // Draw effect geometry...
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default FXLayer;