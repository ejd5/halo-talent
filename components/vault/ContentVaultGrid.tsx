"use client";

import type { ContentAsset } from "@/lib/mock/content-vault";
import { ContentAssetCard } from "./ContentAssetCard";

interface ContentVaultGridProps {
  assets: ContentAsset[];
  onSelectAsset: (asset: ContentAsset) => void;
}

export function ContentVaultGrid({ assets, onSelectAsset }: ContentVaultGridProps) {
  if (assets.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {assets.map((asset) => (
        <ContentAssetCard
          key={asset.id}
          asset={asset}
          onSelect={() => onSelectAsset(asset)}
        />
      ))}
    </div>
  );
}
