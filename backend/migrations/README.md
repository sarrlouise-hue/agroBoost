# Migrations de Base de Données

Ce dossier contient les scripts de migration pour mettre à jour la structure de la base de données.

## Migrations disponibles

### 20250101-change-otp-phone-to-email.js

**Description:** Remplace la colonne `phoneNumber` par `email` dans la table `otps` pour permettre l'authentification par email au lieu du téléphone.

**Date:** 2025-01-01

**Changements:**
- Supprime la colonne `phoneNumber`
- Ajoute la colonne `email` avec contrainte NOT NULL
- Met à jour les index pour utiliser `email` au lieu de `phoneNumber`

**⚠️ Important:**
- Cette migration supprime les données existantes dans la colonne `phoneNumber`
- Les anciens OTP basés sur `phoneNumber` deviendront invalides
- Assurez-vous d'avoir une sauvegarde de la base de données avant d'exécuter cette migration

## Exécution des migrations

### Migration OTP -> Email

```bash
npm run migrate:otp-email
```

Ou directement :

```bash
node migrations/20250101-change-otp-phone-to-email.js
```

## Vérification

Après avoir exécuté la migration, vous pouvez vérifier que la structure est correcte :

```sql
-- Vérifier que la colonne email existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'otps'
ORDER BY ordinal_position;

-- Vérifier les index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'otps';
```

Vous devriez voir :
- Colonne `email` de type `VARCHAR(255)` avec `is_nullable = NO`
- Index `otps_email_code_idx` sur les colonnes `(email, code)`
- Pas de colonne `phoneNumber`

## Rollback

Si vous devez annuler cette migration, vous pouvez exécuter :

```sql
-- ⚠️ ATTENTION: Cela supprimera toutes les données OTP existantes
ALTER TABLE otps DROP COLUMN IF EXISTS email;
ALTER TABLE otps ADD COLUMN "phoneNumber" VARCHAR(255);
CREATE INDEX IF NOT EXISTS otps_phone_number_code_idx ON otps("phoneNumber", code);
```

## Notes

- Les migrations sont exécutées dans une transaction pour garantir la cohérence
- En cas d'erreur, la transaction est automatiquement annulée (rollback)
- Les migrations sont idempotentes : elles peuvent être exécutées plusieurs fois sans problème

