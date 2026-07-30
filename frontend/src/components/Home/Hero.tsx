import React from "react";
import { Link } from "../../router";
import { Search, Tractor, Star, ArrowRight } from "lucide-react";

interface HeroProps {
  totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
  return (
    <section className="relative overflow-hidden min-h-[92vh] lg:min-h-[720px] flex items-center">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/trac.png')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 lg:bg-gradient-to-r lg:from-white/90 lg:via-white/55 lg:to-black/25" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">

        <div className="max-w-2xl py-16 lg:py-24">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold shadow">
            <Star className="w-4 h-4 fill-current" />
            Plateforme N°1 au Sénégal
          </div>

          {/* Title */}
          <h1 className="mt-6 text-[44px] sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white lg:text-gray-900">

            Louez du matériel agricole

            <span className="block text-green-300 lg:text-green-600">
              en toute simplicité
            </span>

          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg lg:text-xl leading-relaxed text-white lg:text-gray-700 max-w-xl">
            La première place de marché pour l'agriculture au Sénégal.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <Link to="/machines" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-3 shadow-xl transition-all duration-300 hover:scale-105">

                <Search className="w-5 h-5" />

                Rechercher du matériel

                <ArrowRight className="w-5 h-5" />

              </button>
            </Link>

            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-8 rounded-xl bg-white/90 backdrop-blur border border-white hover:bg-white text-green-700 font-semibold shadow-xl transition-all duration-300 hover:scale-105">

                Devenir prestataire

              </button>
            </Link>

          </div>

          {/* Card */}
          {totalCount > 0 && (

            <div className="mt-10 inline-flex items-center gap-4 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl">

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Tractor className="w-6 h-6 text-green-600" />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {totalCount}+
                </h3>

                <p className="text-gray-500 text-sm">
                  Machines disponibles
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
};
