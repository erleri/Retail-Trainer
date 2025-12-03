import { openDB } from 'idb';

const DB_NAME = 'gtm-manager-db';
const DB_VERSION = 2;

export const localDB = {
    async getDB() {
        return openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Store for uploaded files
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'id' });
                }
                // Store for generated courses
                if (!db.objectStoreNames.contains('courses')) {
                    db.createObjectStore('courses', { keyPath: 'id' });
                }
                // Store for generated quizzes
                if (!db.objectStoreNames.contains('quizzes')) {
                    db.createObjectStore('quizzes', { keyPath: 'courseId' });
                }
                // Store for generated FAQs
                if (!db.objectStoreNames.contains('faqs')) {
                    db.createObjectStore('faqs', { keyPath: 'id', autoIncrement: true });
                }
            },
        });
    },

    // --- Files ---
    async saveFile(fileData) {
        const db = await this.getDB();
        return db.put('files', fileData);
    },

    async getFiles() {
        const db = await this.getDB();
        return db.getAll('files');
    },

    async deleteFile(id) {
        const db = await this.getDB();
        return db.delete('files', id);
    },

    // --- Courses ---
    async saveCourse(course) {
        const db = await this.getDB();
        return db.put('courses', course);
    },

    async getCourses() {
        const db = await this.getDB();
        return db.getAll('courses');
    },

    // --- Quizzes ---
    async saveQuiz(courseId, quizData) {
        const db = await this.getDB();
        return db.put('quizzes', { courseId, questions: quizData });
    },

    async getQuiz(courseId) {
        const db = await this.getDB();
        const result = await db.get('quizzes', courseId);
        return result ? result.questions : null;
    },

    // --- FAQs ---
    async saveFAQs(faqs) {
        const db = await this.getDB();
        const tx = db.transaction('faqs', 'readwrite');
        const store = tx.objectStore('faqs');
        for (const faq of faqs) {
            await store.put(faq);
        }
        await tx.done;
    },

    async getFAQs() {
        const db = await this.getDB();
        return db.getAll('faqs');
    },

    async deleteFAQ(id) {
        const db = await this.getDB();
        return db.delete('faqs', id);
    },

    async deleteCourse(id) {
        const db = await this.getDB();
        // Delete the course
        await db.delete('courses', id);
        // Also delete the associated quiz
        await db.delete('quizzes', id);
    }
};
