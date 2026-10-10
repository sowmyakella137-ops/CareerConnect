import api from './api.js';

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const resumeService = {
  /**
   * Upload a PDF resume to extract skills via backend PDFBox parser
   * @param {File} file - PDF file instance
   * @param {Function} onUploadProgress - Optional progress callback
   */
  async uploadResume(file, onUploadProgress) {
    if (!file) {
      throw new Error('Please select a file to upload.');
    }

    // Client-side validations matching backend constraints
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Only PDF resume files are accepted.');
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      throw new Error(`File exceeds the maximum limit of 5 MB (Current size: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percent);
        }
      },
    });

    return response.data;
  },
};

export default resumeService;
