import React from "react";
import { Link } from "../../router";
import { Search, Tractor, Star, ArrowRight } from "lucide-react";

interface HeroProps {
  totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
  return (
    <section className="relative overflow-hidden min-h-[700px] flex items-center">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmE0ZDRkYWJjZjcwODE5MWEyMzg0YzExYmRiNzdmYzU6ZmlsZV8wMDAwMDAwMGI1Mzg3MWY0OWY0YTViMGQyNjExMDc2YSIsImdpem1vX2lkIjpudWxsLCJ3aWQiOm51bGwsIm9pZCI6bnVsbCwidHMiOiIyMDY2NCIsInAiOiJweWkiLCJjaWQiOiIxIiwic2lnIjoiYjFiYjdkOGIzMTdhY2JhNTM0OTdjNmViYzExMjY5YjgyM2QxYTgxMzUyNzc4ZTE4MzU1MmJkNzQ1OTMzYjVmNiIsInYiOiIwIiwiY3MiOm51bGwsImNkbiI6bnVsbCwiZm4iOm51bGwsImNkIjpudWxsLCJjcCI6bnVsbCwibWEiOm51bGx9')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-black/20"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6">
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm shadow">
            <Star className="w-4 h-4 fill-current" />
            Plateforme N°1 au Sénégal
          </div>

          {/* Title */}
          <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Louez du matériel agricole
            <span className="block text-green-600 mt-2">
              en toute simplicité
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-xl text-gray-700 leading-relaxed">
            La première plateforme de location de matériel agricole
            reliant propriétaires et agriculteurs partout au Sénégal.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <Link to="/machines">
              <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all hover:scale-105">
                <Search size={20} />
                Rechercher du matériel
                <ArrowRight size={18} />
              </button>
            </Link>

            <Link to="/register">
              <button className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all">
                Devenir prestataire
              </button>
            </Link>

          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="mt-12 inline-flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-5">

              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                <Tractor className="w-7 h-7 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalCount}+
                </h3>

                <p className="text-gray-600">
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
