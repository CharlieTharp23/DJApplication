import {
  collection, addDoc, doc, updateDoc, arrayUnion,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { ITunesSong } from './itunes';

export interface QueueSong {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  addedBy: string;
  votes: number;
  votedBy: string[];
  played: boolean;
}

const QUEUE_ID = 'main'; 

export function listenToQueue(callback: (songs: QueueSong[]) => void) {
  const q = query(
    collection(db, 'queues', QUEUE_ID, 'songs'),
    orderBy('votes', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const songs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as QueueSong));
    callback(songs);
  });
}

export async function addSongToQueue(song: ITunesSong, userId: string) {
  await addDoc(collection(db, 'queues', QUEUE_ID, 'songs'), {
    title: song.trackName,
    artist: song.artistName,
    artworkUrl: song.artworkUrl100,
    addedBy: userId,
    votes: 0,
    votedBy: [],
    played: false,
    addedAt: serverTimestamp()
  });
}

export async function voteSong(songId: string, userId: string, currentVotedBy: string[]) {
  if (currentVotedBy.includes(userId)) return; // already voted
  const songRef = doc(db, 'queues', QUEUE_ID, 'songs', songId);
  await updateDoc(songRef, {
    votes: currentVotedBy.length + 1,
    votedBy: arrayUnion(userId)
  });
}