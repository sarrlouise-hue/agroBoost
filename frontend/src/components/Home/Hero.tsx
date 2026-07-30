import React from "react";
import { Link } from "../../router";
import { Search, Tractor, Star, ArrowRight } from "lucide-react";

interface HeroProps {
  totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[700px] overflow-hidden">

      {/* Image */}
      <img
        src="/trac.png"
        alt="Tracteur"
        className="absolute inset-0 h-full w-full object-cover object-[78%_center] lg:object-right"
      />

      {/* Overlay Mobile */}
      <div className="absolute inset-0 bg-black/45 lg:hidden" />

      {/* Overlay Desktop */}
      <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-white/90 via-white/55 to-transparent" />

      {/* Contenu */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6">

          <div className="max-w-xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 font-medium text-green-700 shadow-lg">
              <Star className="h-4 w-4 fill-current" />
              Plateforme N°1 au Sénégal
            </div>

            {/* Titre */}
            <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-6xl lg:text-gray-900">
              Louez du matériel agricole

              <span className="mt-2 block text-green-300 lg:text-green-600">
                en toute simplicité
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-xl leading-relaxed text-white lg:text-gray-700">
              La première place de marché pour l'agriculture au Sénégal.
            </p>

            {/* Boutons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link to="/machines" className="w-full sm:w-auto">
                <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-8 font-semibold text-white shadow-xl transition hover:bg-green-700 hover:scale-[1.02]">

                  <Search className="h-5 w-5" />

                  Rechercher du matériel

                  <ArrowRight className="h-5 w-5" />

                </button>
              </Link>

              <Link to="/register" className="w-full sm:w-auto">
                <button className="h-14 w-full rounded-xl bg-white px-8 font-semibold text-green-700 shadow-xl transition hover:bg-green-50 hover:scale-[1.02]">

                  Devenir prestataire

                </button>
              </Link>

            </div>

            {/* Statistique */}
            {totalCount > 0 && (
              <div className="mt-10 inline-flex items-center gap-4 rounded-2xl bg-white p-5 shadow-2xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                  <Tractor className="h-7 w-7 text-green-600" />
                </div>

                <div>

                  <div className="text-3xl font-bold">
                    {totalCount}+
                  </div>

                  <div className="text-gray-500">
                    Machines disponibles
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

    </section>
  );
};
