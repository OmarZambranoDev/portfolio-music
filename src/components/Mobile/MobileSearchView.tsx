import { useState } from 'react';
import { SearchBar } from '@portfolio/ui';
import { useMusicStore } from '../../store/musicStore';

export function MobileSearchView() {
  const { setSearchQuery } = useMusicStore();
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    setSearchQuery(value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-earth-forest mb-4">Search</h1>
      <SearchBar
        value={query}
        onChange={handleSearch}
        placeholder="Search songs, artists, or albums..."
        variant="default"
        size="md"
      />
      {query && (
        <p className="text-earth-moss mt-4 text-center">Use the Library tab to browse results.</p>
      )}
    </div>
  );
}
