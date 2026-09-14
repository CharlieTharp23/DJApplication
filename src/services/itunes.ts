export interface ITunesSong {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}

export async function searchSongs(term: string): Promise<ITunesSong[]> {
  if (!term.trim()) return [];
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=10`
  );
  const data = await res.json();
  return data.results;
}