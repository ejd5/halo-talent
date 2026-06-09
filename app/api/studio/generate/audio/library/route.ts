import { NextResponse } from "next/server";

interface LibraryTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string[];
  genre: string;
  tempo: "slow" | "medium" | "fast";
  source: string;
  previewUrl: string;
  downloadUrl: string;
  trending: boolean;
  tags: string[];
}

const TRACKS: LibraryTrack[] = [
  {
    id: "lib-1", title: "Sunset Dreams", artist: "Aurelie", duration: 180,
    mood: ["calm", "happy"], genre: "Lo-fi", tempo: "slow",
    source: "Pixabay", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["chill", "summer", "relax"],
  },
  {
    id: "lib-2", title: "Neon Nights", artist: "Electra", duration: 210,
    mood: ["energetic", "dark"], genre: "Electronic", tempo: "fast",
    source: "FMA", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["night", "club", "edm"],
  },
  {
    id: "lib-3", title: "Gentle Breeze", artist: "Luna", duration: 150,
    mood: ["calm", "peaceful"], genre: "Ambient", tempo: "slow",
    source: "Pixabay", previewUrl: "", downloadUrl: "", trending: false,
    tags: ["nature", "meditation", "yoga"],
  },
  {
    id: "lib-4", title: "Urban Flow", artist: "BeatSmith", duration: 195,
    mood: ["energetic", "happy"], genre: "Hip-hop", tempo: "medium",
    source: "Mixkit", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["urban", "beat", "vlog"],
  },
  {
    id: "lib-5", title: "Cinematic Rise", artist: "Orion", duration: 240,
    mood: ["epic", "dramatic"], genre: "Cinematic", tempo: "medium",
    source: "FMA", previewUrl: "", downloadUrl: "", trending: false,
    tags: ["film", "trailer", "inspirational"],
  },
  {
    id: "lib-6", title: "Tropical Vibes", artist: "Cali", duration: 165,
    mood: ["happy", "energetic"], genre: "Pop", tempo: "fast",
    source: "Pixabay", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["summer", "dance", "tropical"],
  },
  {
    id: "lib-7", title: "Midnight Jazz", artist: "BlueNote", duration: 220,
    mood: ["calm", "dark"], genre: "Jazz", tempo: "slow",
    source: "FMA", previewUrl: "", downloadUrl: "", trending: false,
    tags: ["jazz", "night", "lounge"],
  },
  {
    id: "lib-8", title: "Power Up", artist: "Volt", duration: 120,
    mood: ["energetic", "epic"], genre: "Electronic", tempo: "fast",
    source: "Mixkit", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["gaming", "sports", "motivation"],
  },
  {
    id: "lib-9", title: "Soft Piano", artist: "Classica", duration: 300,
    mood: ["calm", "peaceful"], genre: "Classical", tempo: "slow",
    source: "Pixabay", previewUrl: "", downloadUrl: "", trending: false,
    tags: ["piano", "study", "focus"],
  },
  {
    id: "lib-10", title: "Summer Anthem", artist: "Sunset Kids", duration: 185,
    mood: ["happy", "energetic"], genre: "Pop", tempo: "fast",
    source: "FMA", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["summer", "party", "tiktok"],
  },
  {
    id: "lib-11", title: "Deep Focus", artist: "Concentrate", duration: 360,
    mood: ["calm", "peaceful"], genre: "Ambient", tempo: "slow",
    source: "Pixabay", previewUrl: "", downloadUrl: "", trending: false,
    tags: ["study", "work", "focus"],
  },
  {
    id: "lib-12", title: "Retro Wave", artist: "Synthwave", duration: 200,
    mood: ["dark", "energetic"], genre: "Electronic", tempo: "medium",
    source: "Mixkit", previewUrl: "", downloadUrl: "", trending: true,
    tags: ["retro", "synth", "80s"],
  },
];

const MOODS = ["calm", "happy", "energetic", "epic", "dark", "peaceful", "dramatic"];
const GENRES = ["Lo-fi", "Electronic", "Ambient", "Hip-hop", "Cinematic", "Pop", "Jazz", "Classical"];
const TEMPOS = ["slow", "medium", "fast"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mood = url.searchParams.get("mood");
  const genre = url.searchParams.get("genre");
  const tempo = url.searchParams.get("tempo");
  const search = url.searchParams.get("search")?.toLowerCase();
  const trending = url.searchParams.get("trending") === "true";

  let filtered = [...TRACKS];

  if (mood && MOODS.includes(mood)) filtered = filtered.filter((t) => t.mood.includes(mood));
  if (genre && GENRES.includes(genre)) filtered = filtered.filter((t) => t.genre === genre);
  if (tempo && TEMPOS.includes(tempo)) filtered = filtered.filter((t) => t.tempo === tempo);
  if (trending) filtered = filtered.filter((t) => t.trending);
  if (search) filtered = filtered.filter((t) => t.title.toLowerCase().includes(search) || t.artist.toLowerCase().includes(search) || t.tags.some((tag) => tag.includes(search)));

  return NextResponse.json({
    tracks: filtered,
    filters: { moods: MOODS, genres: GENRES, tempos: TEMPOS },
  });
}
