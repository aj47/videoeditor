class VideoChunker {
    static CHUNK_SIZE = 1024 * 1024 * 1024; // 1GB in bytes

    static async* createChunks(file) {
        const totalSize = file.size;
        let start = 0;

        while (start < totalSize) {
            const end = Math.min(start + this.CHUNK_SIZE, totalSize);
            const chunk = file.slice(start, end);
            yield {
                chunk,
                start,
                end,
                total: totalSize,
                isLastChunk: end === totalSize
            };
            start = end;
        }
    }

    static async processInChunks(file, processChunk) {
        const chunks = this.createChunks(file);
        const results = [];

        for await (const chunkInfo of chunks) {
            try {
                const result = await processChunk(chunkInfo);
                results.push(result);
            } catch (error) {
                throw new Error(`Error processing chunk ${chunkInfo.start}-${chunkInfo.end}: ${error.message}`);
            }
        }

        return results;
    }
}
