import { PlatformCards } from "@/components/dashboard/PlatformCards";

export default function PlatformsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-brand-ivory italic">
          Mes plateformes
        </h1>
        <p className="text-brand-taupe mt-2">
          Gérez vos comptes connectés et synchronisez vos statistiques.
        </p>
      </div>
      <PlatformCards />
    </div>
  );
}
