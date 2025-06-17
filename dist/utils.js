import { readdir } from 'node:fs/promises';
import { resolve, parse, join } from 'node:path';
export async function requireDir(dir) {
    return await importModulesFromDirectory(dir);
}
export async function importModulesFromDirectory(directoryPath) {
    const modules = {};
    const absolutePath = resolve(directoryPath); // Get absolute path
    try {
        const files = await readdir(absolutePath);
        for (const file of files) {
            if (file.endsWith('.js') || file.endsWith('.ts')) { // Look for compiled .js files
                const fileName = parse(file).name; // Get file name without extension
                const filePath = join(absolutePath, file);
                try {
                    // Dynamic import
                    // Node.js will load the .js file. If you have "type": "module" in package.json,
                    // it will treat it as ESM. Otherwise, it will treat it as CJS.
                    // The 'as any' is a type assertion because TS can't infer the exact module shape.
                    const module = await import(filePath);
                    // You'll need to decide how to extract from the module object:
                    // If each file has a default export you want:
                    modules[fileName] = (module.default || module); // Use default if present, else the whole module
                    // If you want all named exports from each module:
                    // modules[fileName] = module as T;
                }
                catch (importError) {
                    console.error(`Failed to import module ${file}:`, importError.message);
                    // Decide if you want to skip or throw
                }
            }
        }
    }
    catch (readDirError) {
        console.error(`Error reading directory ${directoryPath}:`, readDirError.message);
        throw readDirError; // Re-throw to propagate the error
    }
    return modules;
}
//# sourceMappingURL=utils.js.map