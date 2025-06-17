import { readdir } from 'node:fs/promises';
import { resolve, parse, join } from 'node:path';

export async function requireDir(dir: string) {
    return await importModulesFromDirectory(dir)
}

// Define the expected type of your imported modules
// Adjust this based on what your handler files actually export
interface HandlerModule {
    [key: string]: any; // Could be a function, an object, etc.
    default?: any; // If modules have default exports
}
export async function importModulesFromDirectory<T = HandlerModule>(
    directoryPath: string
): Promise<{ [key: string]: T }> {
    const modules: { [key: string]: T } = {};
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
                    modules[fileName] = (module.default || module) as T; // Use default if present, else the whole module

                    // If you want all named exports from each module:
                    // modules[fileName] = module as T;

                } catch (importError: any) {
                    console.error(`Failed to import module ${file}:`, importError.message);
                    // Decide if you want to skip or throw
                }
            }
        }
    } catch (readDirError: any) {
        console.error(`Error reading directory ${directoryPath}:`, readDirError.message);
        throw readDirError; // Re-throw to propagate the error
    }

    return modules;
}