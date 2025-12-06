import 'package:flutter/material.dart';
import 'package:agro_boost/core/constants/app_colors.dart';
import 'package:agro_boost/core/constants/app_styles.dart';
import 'package:agro_boost/screens/home_screen.dart'; // Pour ServiceItem
import 'package:agro_boost/screens/service_detail_screen.dart'; // Pour Review

class ReviewDetailScreen extends StatefulWidget {
  final ServiceItem service;
  final List<Review> reviews;

  const ReviewDetailScreen({
    Key? key,
    required this.service,
    required this.reviews,
  }) : super(key: key);

  @override
  State<ReviewDetailScreen> createState() => _ReviewDetailScreenState();
}

class _ReviewDetailScreenState extends State<ReviewDetailScreen> {
  String _sortBy = 'recent';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.veryLightGrey,
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // =========================================
            // 1️⃣ RÉSUMÉ DES AVIS
            // =========================================
            _buildReviewsSummary(),

            // =========================================
            // 2️⃣ DISTRIBUTION DES NOTES
            // =========================================
            _buildRatingDistribution(),

            // =========================================
            // 3️⃣ TRI DES AVIS
            // =========================================
            _buildSortBar(),

            // =========================================
            // 4️⃣ LISTE DES AVIS
            // =========================================
            _buildReviewsList(),

            const SizedBox(height: AppStyles.spacing24),
          ],
        ),
      ),
    );
  }

  // =========================================
  // 🔷 APP BAR
  // =========================================
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: AppColors.primary,
      elevation: 0,
      title: Text(
        'Tous les avis',
        style: AppStyles.headingMedium.copyWith(
          color: Colors.white,
          fontSize: 18,
        ),
      ),
      centerTitle: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back, color: Colors.white),
        onPressed: () => Navigator.pop(context),
      ),
    );
  }

  // =========================================
  // 🔷 RÉSUMÉ DES AVIS
  // =========================================
  Widget _buildReviewsSummary() {
    double averageRating = _calculateAverageRating();

    return Container(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: AppStyles.spacing12),
      padding: const EdgeInsets.all(AppStyles.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '📊 Résumé',
            style: AppStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Grande note
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  Text(
                    averageRating.toStringAsFixed(1),
                    style: AppStyles.headingSmall.copyWith(
                      fontSize: 48,
                      color: AppColors.primaryGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Row(
                    children: List.generate(
                      5,
                          (index) => Icon(
                        index < averageRating.toInt()
                            ? Icons.star
                            : Icons.star_outline,
                        size: 18,
                        color: Colors.amber,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: AppStyles.spacing24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${widget.reviews.length} avis',
                      style: AppStyles.bodyLarge.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppStyles.spacing8),
                    Text(
                      'Service: ${widget.service.title}',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppStyles.bodyMedium.copyWith(
                        color: AppColors.grey,
                      ),
                    ),
                    const SizedBox(height: AppStyles.spacing12),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppStyles.spacing8,
                        vertical: AppStyles.spacing4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.success.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'Très bien évalué',
                        style: AppStyles.caption.copyWith(
                          color: AppColors.success,
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 DISTRIBUTION DES NOTES
  // =========================================
  Widget _buildRatingDistribution() {
    final distribution = _calculateRatingDistribution();

    return Container(
      color: Colors.white,
      margin: const EdgeInsets.only(bottom: AppStyles.spacing12),
      padding: const EdgeInsets.all(AppStyles.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '📈 Distribution des notes',
            style: AppStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppStyles.spacing16),

          // Distribution
          ...List.generate(5, (index) {
            int stars = 5 - index;
            int count = distribution[stars] ?? 0;
            int percentage =
            widget.reviews.isEmpty ? 0 : (count * 100 ~/ widget.reviews.length);

            return Padding(
              padding: const EdgeInsets.only(bottom: AppStyles.spacing12),
              child: Row(
                children: [
                  // Étoiles
                  SizedBox(
                    width: 60,
                    child: Row(
                      children: [
                        Text(
                          '$stars',
                          style: AppStyles.bodySmall.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Icon(Icons.star, size: 14, color: Colors.amber),
                      ],
                    ),
                  ),
                  // Barre
                  Expanded(
                    child: Stack(
                      children: [
                        Container(
                          height: 8,
                          decoration: BoxDecoration(
                            color: AppColors.lightGrey,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                        Container(
                          height: 8,
                          width: (percentage / 100) * 200,
                          decoration: BoxDecoration(
                            color: AppColors.primaryGreen,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppStyles.spacing8),
                  // Pourcentage
                  SizedBox(
                    width: 50,
                    child: Text(
                      '$percentage%',
                      textAlign: TextAlign.end,
                      style: AppStyles.caption.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 BARRE DE TRI
  // =========================================
  Widget _buildSortBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(
        horizontal: AppStyles.spacing16,
        vertical: AppStyles.spacing12,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Trier par:',
            style: AppStyles.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              setState(() => _sortBy = value);
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(
                value: 'recent',
                child: Text('Plus récents'),
              ),
              const PopupMenuItem(
                value: 'rating_high',
                child: Text('Meilleur rating'),
              ),
              const PopupMenuItem(
                value: 'rating_low',
                child: Text('Pire rating'),
              ),
            ],
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.spacing12,
                vertical: AppStyles.spacing8,
              ),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(AppStyles.radiusSmall),
              ),
              child: Row(
                children: [
                  Text(
                    _getSortLabel(_sortBy),
                    style: AppStyles.caption.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: AppStyles.spacing6),
                  const Icon(
                    Icons.arrow_drop_down,
                    color: AppColors.primaryGreen,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 LISTE DES AVIS
  // =========================================
  Widget _buildReviewsList() {
    final sortedReviews = _getSortedReviews();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppStyles.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tous les avis (${widget.reviews.length})',
            style: AppStyles.bodyLarge.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppStyles.spacing12),
          ...sortedReviews.map((review) => _buildReviewCard(review)),
        ],
      ),
    );
  }

  Widget _buildReviewCard(Review review) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppStyles.spacing12),
      padding: const EdgeInsets.all(AppStyles.spacing16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppStyles.radiusMedium),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // En-tête: Client + Date
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Client
              Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundColor: AppColors.primaryGreen.withOpacity(0.2),
                    child: const Icon(
                      Icons.person,
                      size: 24,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  const SizedBox(width: AppStyles.spacing12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        review.clientName,
                        style: AppStyles.bodyMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _formatDate(review.date),
                        style: AppStyles.caption.copyWith(
                          color: AppColors.grey,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              // Rating
              Row(
                children: List.generate(
                  5,
                      (index) => Icon(
                    index < review.rating ? Icons.star : Icons.star_outline,
                    size: 16,
                    color: Colors.amber,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Commentaire
          Text(
            review.comment,
            style: AppStyles.bodyMedium.copyWith(
              color: AppColors.grey,
              height: 1.5,
            ),
          ),
          const SizedBox(height: AppStyles.spacing12),

          // Boutons d'interaction
          Row(
            children: [
              TextButton.icon(
                icon: const Icon(Icons.thumb_up_outlined, size: 16),
                label: const Text('Utile'),
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.primaryGreen,
                  padding: EdgeInsets.zero,
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Merci pour votre avis!'),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
              ),
              const SizedBox(width: AppStyles.spacing16),
              TextButton.icon(
                icon: const Icon(Icons.report_outlined, size: 16),
                label: const Text('Signaler'),
                style: TextButton.styleFrom(
                  foregroundColor: AppColors.error,
                  padding: EdgeInsets.zero,
                ),
                onPressed: () {
                  _showReportDialog(review);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 DIALOGUE SIGNALEMENT
  // =========================================
  void _showReportDialog(Review review) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Signaler cet avis'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Pourquoi signalez-vous cet avis?',
              style: AppStyles.bodyMedium,
            ),
            const SizedBox(height: AppStyles.spacing16),
            ...[
              'Contenu offensant',
              'Spam',
              'Faux avis',
              'Autre',
            ].map((reason) => RadioListTile<String>(
              title: Text(reason),
              value: reason,
              groupValue: null,
              onChanged: (value) {},
            )),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Merci! Votre signalement a été reçu.'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Signaler'),
          ),
        ],
      ),
    );
  }

  // =========================================
  // 🔷 UTILITAIRES
  // =========================================
  double _calculateAverageRating() {
    if (widget.reviews.isEmpty) return 0;
    double total = 0;
    for (var review in widget.reviews) {
      total += review.rating;
    }
    return total / widget.reviews.length;
  }

  Map<int, int> _calculateRatingDistribution() {
    Map<int, int> distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    for (var review in widget.reviews) {
      distribution[review.rating] = (distribution[review.rating] ?? 0) + 1;
    }
    return distribution;
  }

  List<Review> _getSortedReviews() {
    List<Review> sorted = [...widget.reviews];
    switch (_sortBy) {
      case 'recent':
        sorted.sort((a, b) => b.date.compareTo(a.date));
        break;
      case 'rating_high':
        sorted.sort((a, b) => b.rating.compareTo(a.rating));
        break;
      case 'rating_low':
        sorted.sort((a, b) => a.rating.compareTo(b.rating));
        break;
    }
    return sorted;
  }

  String _getSortLabel(String value) {
    switch (value) {
      case 'recent':
        return 'Plus récents';
      case 'rating_high':
        return 'Meilleur rating';
      case 'rating_low':
        return 'Pire rating';
      default:
        return 'Trier';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}