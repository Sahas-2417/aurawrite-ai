// ─── Firestore Service Layer ─────────────────────────────────────────────────
// Clean abstraction over Firestore CRUD for user posts.
// Collection structure: users/{uid}/posts/{postId}
// ─────────────────────────────────────────────────────────────────────────────

import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get reference to a user's posts collection */
const getPostsRef = (uid) => collection(db, 'users', uid, 'posts');

/** Get reference to a specific post document */
const getPostDoc = (uid, postId) => doc(db, 'users', uid, 'posts', postId);

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Save a new post to Firestore.
 * @param {string} uid - Firebase user ID
 * @param {object} postData - { text, bulletPoints, tone, length }
 * @returns {string} The generated document ID
 */
export const savePost = async (uid, postData) => {
  try {
    const docRef = await addDoc(getPostsRef(uid), {
      text: postData.text,
      bulletPoints: postData.bulletPoints,
      tone: postData.tone,
      length: postData.length,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save post to cloud');
  }
};

/**
 * Fetch all posts for a user, ordered by newest first.
 * @param {string} uid - Firebase user ID
 * @returns {Array} Array of post objects with id
 */
export const getUserPosts = async (uid) => {
  try {
    const q = query(getPostsRef(uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string for consistency
      timestamp: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to load posts from cloud');
  }
};

/**
 * Delete a single post from Firestore.
 * @param {string} uid - Firebase user ID
 * @param {string} postId - Firestore document ID
 */
export const deletePost = async (uid, postId) => {
  try {
    await deleteDoc(getPostDoc(uid, postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post from cloud');
  }
};

// ─── One-Time Migration ──────────────────────────────────────────────────────

/**
 * Migrate existing localStorage posts to Firestore (one-time).
 * Called on first login. Sets a flag so it doesn't run again.
 * @param {string} uid - Firebase user ID
 * @returns {number} Number of posts migrated
 */
export const migrateLocalPosts = async (uid) => {
  const MIGRATION_KEY = 'aurawrite_migration_done';
  
  // Skip if already migrated
  if (localStorage.getItem(MIGRATION_KEY)) {
    return 0;
  }

  try {
    const raw = localStorage.getItem('saved_posts');
    if (!raw) {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return 0;
    }

    const localPosts = JSON.parse(raw);
    if (!Array.isArray(localPosts) || localPosts.length === 0) {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return 0;
    }

    // Upload each post to Firestore
    let migrated = 0;
    for (const post of localPosts) {
      if (!post?.text) continue;
      
      await addDoc(getPostsRef(uid), {
        text: post.text,
        bulletPoints: post.bulletPoints || '',
        tone: post.tone || 'Professional',
        length: post.length || 'Medium',
        createdAt: post.timestamp ? new Date(post.timestamp) : serverTimestamp(),
      });
      migrated++;
    }

    // Mark migration as complete & clear old localStorage data
    localStorage.setItem(MIGRATION_KEY, 'true');
    localStorage.removeItem('saved_posts');

    return migrated;
  } catch (error) {
    console.error('Migration error:', error);
    // Don't throw — migration failure shouldn't block the app
    return 0;
  }
};
