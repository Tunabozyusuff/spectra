// src/services/userService.ts
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function register(email: string, password: string, extra = {}) {
    const auth = getAuth();

    // 1️⃣  Authentication
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const uid = user.uid;

    // 2️⃣  Firestore
    await setDoc(doc(db, "users", uid), {
        email,
        // şifreyi KESİNLİKLE yazma!
        createdAt: Date.now(),
        ...extra,           // name, role vs.
    });

    return user;
}

export async function firebaseLogin(email: string, password: string) {
    const auth = getAuth();
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // Profil
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const profile = snap.exists() ? snap.data() : null;

    return { user, profile };
}

export async function fetchProfile(uid: string) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Tüm kullanıcıları getir
export async function fetchUsers() {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Tek kullanıcı (id = "1" vb.)
export async function fetchUser(id: string) {
    const ref = doc(db, "users", id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}

// Yeni kullanıcı ekle
export async function addUser(data: Record<string, any>) {
    // id'yi Firestore üretsin
    return await addDoc(collection(db, "users"), data);
}

// Var olan kullanıcıyı güncelle
export async function updateUser(id: string, data: Record<string, any>) {
    return await setDoc(doc(db, "users", id), data, { merge: true });
}
