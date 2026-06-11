const ts = require('typescript');
const fs = require('fs');
const path = require('path');

function compile(fileNames, options) {
  console.log('Programmatically compiling TypeScript tests and dependencies...');
  
  // Create a program from the files and options
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  // Get pre-emit diagnostics (compiler errors) and emit diagnostics
  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      console.error(
        `[TypeScript Error] ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.error(`[TypeScript Error] ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    }
  });

  return !emitResult.emitSkipped && allDiagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length === 0;
}

const targetDir = path.join(__dirname, '../dist-tests');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Compile tests/integration.test.ts and tests/test-framework.ts
const filesToCompile = [
  path.join(__dirname, '../tests/integration.test.ts'),
  path.join(__dirname, '../tests/test-framework.ts')
];

const compilerOptions = {
  noEmit: false,
  outDir: targetDir,
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  resolveJsonModule: true,
  skipLibCheck: true,
  allowJs: true,
  baseUrl: path.join(__dirname, '..'),
  paths: {
    "@/*": ["./*"]
  }
};

const compileSuccess = compile(filesToCompile, compilerOptions);

if (!compileSuccess) {
  console.error('\n❌ Compilation failed! Stopping test execution.');
  process.exit(1);
}

console.log('✓ Compilation completed successfully.\n');

// Mock browser/next environment variables and globals needed for APIs
global.Request = global.Request || function(url, init) {
  const parsed = new URL(url);
  return {
    url,
    method: init?.method || 'GET',
    headers: new Map(Object.entries(init?.headers || {})),
    json: async () => JSON.parse(init?.body || '{}'),
    text: async () => init?.body || '',
  };
};

console.log('Starting Test Execution...\n');
try {
  // Require and run the compiled integration tests
  require('../dist-tests/tests/integration.test.js');
} catch (err) {
  console.error('\n❌ Unhandled error during test execution:', err);
  process.exit(1);
}
