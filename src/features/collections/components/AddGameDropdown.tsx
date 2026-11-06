'use client';

import { useState, useEffect, useMemo } from 'react';
import { DatabaseGameCatalog } from '@/types/database';
import { useCollectionActions } from '../hooks/useCollections';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Loader2,
  Gamepad2,
  Globe,
  ChevronDown,
  X,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface AddGameDropdownProps {
  collectionId: string;
  existingGames?: DatabaseGameCatalog[];
  onGameAdded?: (game: DatabaseGameCatalog) => void;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  buttonSize?: 'default' | 'sm' | 'lg';
  buttonLabel?: string;
}

interface DisplayGameItem {
  id?: string;
  igdbId?: number;
  slug: string;
  title: string;
  coverUrl: string | null;
  genre: string | null;
  releaseYear: number | null;
  source: 'library' | 'catalog';
}

export function AddGameDropdown({
  collectionId,
  existingGames = [],
  onGameAdded,
  className,
  buttonVariant = 'default',
  buttonSize = 'sm',
  buttonLabel = 'Add Games',
}: AddGameDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [libraryGames, setLibraryGames] = useState<DisplayGameItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [catalogGames, setCatalogGames] = useState<DisplayGameItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Set of IDs already in the collection (fetched + locally added)
  const [collectionGameIds, setCollectionGameIds] = useState<Set<string>>(new Set());
  const [localAddedIds, setLocalAddedIds] = useState<Set<string>>(new Set());

  const { addGame } = useCollectionActions();
  const debouncedSearch = useDebounce(search.trim(), 350);

  // Load existing collection game IDs when dropdown is opened to guarantee accurate filtering
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadCollectionGames() {
      try {
        const res = await fetch(`/api/collections/${collectionId}`);
        if (res.ok) {
          const json = await res.json();
          const ids = new Set<string>();
          (json.games || []).forEach((g: any) => {
            if (g.id) ids.add(g.id);
            if (g.slug) ids.add(g.slug);
            if (g.igdb_id) ids.add(String(g.igdb_id));
          });
          if (isMounted) setCollectionGameIds(ids);
        }
      } catch (err) {
        console.error('Failed to load collection games:', err);
      }
    }

    loadCollectionGames();
    return () => {
      isMounted = false;
    };
  }, [isOpen, collectionId]);

  // Combined set of all games currently in the collection
  const existingSet = useMemo(() => {
    const ids = new Set<string>(collectionGameIds);
    existingGames.forEach((g) => {
      if (g.id) ids.add(g.id);
      if (g.slug) ids.add(g.slug);
      if (g.igdb_id) ids.add(String(g.igdb_id));
    });
    localAddedIds.forEach((id) => ids.add(id));
    return ids;
  }, [existingGames, collectionGameIds, localAddedIds]);

  const isGameInCollection = (game: DisplayGameItem) => {
    if (game.id && existingSet.has(game.id)) return true;
    if (game.slug && existingSet.has(game.slug)) return true;
    if (game.igdbId && existingSet.has(String(game.igdbId))) return true;
    return false;
  };

  // Load user's library when the dropdown is opened
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadLibrary() {
      try {
        setLibraryLoading(true);
        const res = await fetch('/api/library?limit=100');
        if (res.ok) {
          const json = await res.json();
          const items: DisplayGameItem[] = (json.data || []).map((entry: any) => ({
            id: entry.game_catalog.id,
            igdbId: entry.game_catalog.igdb_id,
            slug: entry.game_catalog.slug,
            title: entry.game_catalog.title,
            coverUrl: entry.game_catalog.cover_url,
            genre: entry.game_catalog.genre,
            releaseYear: entry.game_catalog.release_year,
            source: 'library' as const,
          }));
          if (isMounted) setLibraryGames(items);
        }
      } catch (err) {
        console.error('Failed to load library games:', err);
      } finally {
        if (isMounted) setLibraryLoading(false);
      }
    }

    loadLibrary();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Search catalog when typing in search input
  useEffect(() => {
    if (!isOpen || !debouncedSearch) {
      setCatalogGames([]);
      setCatalogLoading(false);
      return;
    }

    let isMounted = true;
    async function searchCatalog() {
      try {
        setCatalogLoading(true);
        const res = await fetch(
          `/api/games/search?q=${encodeURIComponent(debouncedSearch)}&limit=10`
        );
        if (res.ok) {
          const json = await res.json();
          const items: DisplayGameItem[] = (json.data || []).map((g: any) => ({
            igdbId: g.igdbId,
            slug: g.slug,
            title: g.title,
            coverUrl: g.coverUrl,
            genre: g.genre,
            releaseYear: g.releaseYear,
            source: 'catalog' as const,
          }));
          if (isMounted) setCatalogGames(items);
        }
      } catch (err) {
        console.error('Failed to search catalog:', err);
      } finally {
        if (isMounted) setCatalogLoading(false);
      }
    }

    searchCatalog();
    return () => {
      isMounted = false;
    };
  }, [isOpen, debouncedSearch]);

  const handleAddGame = async (game: DisplayGameItem) => {
    const key = game.id || game.slug;
    setAddingId(key);
    try {
      const result = await addGame(collectionId, game.id, game.slug);

      // Immediately record into localAddedIds so the game disappears from the dropdown
      setLocalAddedIds((prev) => {
        const next = new Set(prev);
        if (game.id) next.add(game.id);
        if (game.slug) next.add(game.slug);
        if (game.igdbId) next.add(String(game.igdbId));
        if (result?.game?.id) next.add(result.game.id);
        if (result?.game?.slug) next.add(result.game.slug);
        if (result?.game?.igdb_id) next.add(String(result.game.igdb_id));
        return next;
      });

      if (result?.game && onGameAdded) {
        onGameAdded(result.game);
      }
    } catch {
      // Error handled by hook toast
    } finally {
      setAddingId(null);
    }
  };

  // Filter out any game already in the collection, then filter by search term
  const filteredLibrary = useMemo(() => {
    // Only games not yet in the collection
    const unadded = libraryGames.filter((g) => !isGameInCollection(g));
    if (!search.trim()) return unadded;

    const q = search.toLowerCase().trim();
    return unadded.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.genre?.toLowerCase().includes(q)
    );
  }, [libraryGames, search, existingSet]);

  // Catalog games filtered so games already in the collection are hidden
  const filteredCatalog = useMemo(() => {
    return catalogGames.filter((g) => !isGameInCollection(g));
  }, [catalogGames, existingSet]);

  const renderGameRow = (game: DisplayGameItem) => {
    const isCurrentAdding = addingId === (game.id || game.slug);

    return (
      <div
        key={`${game.source}-${game.slug}-${game.id || game.igdbId}`}
        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors gap-3 group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
            {game.coverUrl ? (
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="36px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Gamepad2 className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white truncate group-hover:text-primary transition-colors">
              {game.title}
            </h4>
            <p className="text-[10px] text-zinc-400 truncate mt-0.5">
              {[game.releaseYear, game.genre?.split(',')[0]].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2.5 rounded-full text-xs gap-1 hover:bg-primary hover:text-primary-foreground transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleAddGame(game);
            }}
            disabled={isCurrentAdding}
          >
            {isCurrentAdding ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            Add
          </Button>
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={`rounded-full gap-1.5 shadow-md ${className || ''}`}
        >
          <Plus className="w-4 h-4" />
          <span>{buttonLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
      >
        {/* Search header */}
        <div className="p-3 border-b border-white/10 bg-zinc-900/40">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Search games to add..."
              className="pl-9 pr-8 h-9 text-xs bg-zinc-900/90 border-white/10 rounded-xl focus:border-primary/50 text-white placeholder-zinc-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Library Section */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-primary" />
                From Your Library
              </span>
              <span className="text-[10px] lowercase text-zinc-500">
                ({filteredLibrary.length} available)
              </span>
            </div>

            {libraryLoading ? (
              <div className="flex items-center justify-center py-6 text-zinc-500 gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Loading your games...</span>
              </div>
            ) : filteredLibrary.length > 0 ? (
              <div className="space-y-0.5">
                {filteredLibrary.slice(0, 15).map(renderGameRow)}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 text-center py-4 px-2 space-y-1">
                {search ? (
                  <p>No unadded games in your library matching &quot;{search}&quot;.</p>
                ) : libraryGames.length > 0 ? (
                  <div className="flex flex-col items-center gap-1 text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All games in your library are in this collection!</span>
                    <span className="text-[10px] text-zinc-500">Search above to add games from the global catalog.</span>
                  </div>
                ) : (
                  <p>Your library is currently empty.</p>
                )}
              </div>
            )}
          </div>

          {/* Global Catalog Section (when searching) */}
          {debouncedSearch && (
            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Global Catalog
                </span>
                {catalogLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
              </div>

              {catalogLoading ? (
                <div className="flex items-center justify-center py-6 text-zinc-500 gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Searching online catalog...</span>
                </div>
              ) : filteredCatalog.length > 0 ? (
                <div className="space-y-0.5">
                  {filteredCatalog.map(renderGameRow)}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-4 px-2">
                  No unadded catalog games found for &quot;{debouncedSearch}&quot;.
                </p>
              )}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
