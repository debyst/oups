// Configuration Firebase — REMPLACER avec tes propres valeurs
// Va sur https://console.firebase.google.com/ pour créer un projet
const firebaseConfig = {
  apiKey: "AIzaSyDsHlm5r4cUFVy1IkRMl8yzxXn1aXsZOEg",
  authDomain: "oups-festival.firebaseapp.com",
  projectId: "oups-festival",
  storageBucket: "oups-festival.firebasestorage.app",
  messagingSenderId: "231958475030",
  appId: "1:231958475030:web:2655c7b1f7a030407ba037"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Collection des événements
const eventsCollection = db.collection('events');

// Fonctions partagées pour accéder à Firestore
async function loadEventsFromDB() {
  const snapshot = await eventsCollection.orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addEventToDB(eventData) {
  eventData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  const docRef = await eventsCollection.add(eventData);
  return docRef.id;
}

async function updateEventInDB(docId, eventData) {
  await eventsCollection.doc(docId).update(eventData);
}

async function deleteEventFromDB(docId) {
  await eventsCollection.doc(docId).delete();
}

// Compression d'image côté client (max 1600px, JPEG qualité 0.8)
function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        const maxSize = 1600;
        if (w > maxSize || h > maxSize) {
          if (w > h) {
            h = Math.round(h * maxSize / w);
            w = maxSize;
          } else {
            w = Math.round(w * maxSize / h);
            h = maxSize;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
