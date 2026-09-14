import { useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSearchbar, IonList, IonItem, IonThumbnail, IonImg,
  IonLabel, IonButton, IonBadge
} from '@ionic/react';
import { ensureSignedIn } from '../firebase';
import { searchSongs, ITunesSong } from '../services/itunes';
import { listenToQueue, addSongToQueue, voteSong, QueueSong } from '../services/queue';

const Home: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ITunesSong[]>([]);
  const [queue, setQueue] = useState<QueueSong[]>([]);

  useEffect(() => {
    ensureSignedIn((user) => setUserId(user.uid));
    const unsubscribe = listenToQueue(setQueue);
    return () => unsubscribe();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setResults(await searchSongs(term));
  };

  /*
  const handleAdd = async (song: ITunesSong) => {
    if (!userId) return;
    await addSongToQueue(song, userId);
    setSearchTerm('');
    setResults([]);
  }; */ 

  const handleAdd = async (song: ITunesSong) => {
  console.log('Attempting add, userId is:', userId);
  if (!userId) {
    console.log('BLOCKED: no userId, sign-in likely failed');
    return;
  }
  try {
    await addSongToQueue(song, userId);
    console.log('Write succeeded');
  } catch (err) {
    console.error('Write failed:', err);
  }
  setSearchTerm('');
  setResults([]);
};

  const handleVote = (song: QueueSong) => {
    if (!userId) return;
    voteSong(song.id, userId, song.votedBy);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar><IonTitle>DJ Queue</IonTitle></IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => handleSearch(e.detail.value!)}
          placeholder="Search a song to add..."
        />
        {results.length > 0 && (
          <IonList>
            {results.map((song) => (
              <IonItem key={song.trackId} button onClick={() => handleAdd(song)}>
                <IonThumbnail slot="start"><IonImg src={song.artworkUrl100} /></IonThumbnail>
                <IonLabel>
                  <h2>{song.trackName}</h2>
                  <p>{song.artistName}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <h2 style={{ marginTop: '24px' }}>Now Playing / Up Next</h2>
        <IonList>
          {queue.map((song) => (
            <IonItem key={song.id}>
              <IonThumbnail slot="start"><IonImg src={song.artworkUrl} /></IonThumbnail>
              <IonLabel>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
              </IonLabel>
              <IonBadge slot="end" color="medium">{song.votes} votes</IonBadge>
              <IonButton slot="end" onClick={() => handleVote(song)}>▲ Vote</IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;