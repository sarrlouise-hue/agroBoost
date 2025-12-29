import 'package:flutter/material.dart';
import 'package:allotracteur/review_data.dart';
import 'package:allotracteur/pages/reservation_screen.dart';
import 'package:allotracteur/tractor_data.dart';

class TractorDetailScreen extends StatefulWidget {
  const TractorDetailScreen({
    required this.tractor,
    required this.language,
    super.key,
  });

  final TractorData tractor;

  final String language;

  @override
  State<TractorDetailScreen> createState() {
    return _TractorDetailScreenState();
  }
}

class _TractorDetailScreenState extends State<TractorDetailScreen> {
  bool _isFavorite = false;

  int _currentImageIndex = 0;

  DateTime? _selectedDate;

  final List<String> _tractorImages = [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800',
    'https://images.unsplash.com/photo-1574762020959-d938e88ee33f?w=800',
  ];

  final List<ReviewData> _reviews = [
    ReviewData(
      userName: 'Amadou Ba',
      rating: 5.0,
      comment: 'Excellent service, tracteur en très bon état !',
      date: DateTime.now().subtract(const Duration(days: 5)),
    ),
    ReviewData(
      userName: 'Fatou Diallo',
      rating: 4.5,
      comment: 'Bon tracteur, le propriétaire est très professionnel.',
      date: DateTime.now().subtract(const Duration(days: 12)),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final bool isWolof = widget.language == 'wo';
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(isWolof),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildMainInfo(isWolof),
                const Divider(height: 32.0),
                _buildSpecifications(isWolof),
                const Divider(height: 32.0),
                _buildOwnerInfo(isWolof),
                const Divider(height: 32.0),
                _buildAvailabilityCalendar(isWolof),
                const Divider(height: 32.0),
                _buildReviews(isWolof),
                const SizedBox(height: 100.0),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(isWolof),
    );
  }

  Widget _buildSpecifications(bool isWolof) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isWolof ? 'Spécifikasioŋ' : 'Spécifications',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16.0),
          _buildSpecItem(Icons.build, 'Modèle', 'John Deere 5065E'),
          _buildSpecItem(Icons.speed, 'Puissance', '65 HP'),
          _buildSpecItem(Icons.calendar_today, 'Année', '2020'),
          _buildSpecItem(
            Icons.agriculture,
            'Type',
            isWolof ? 'Labour' : 'Labour',
          ),
          _buildSpecItem(
            Icons.check_circle,
            'État',
            isWolof ? 'Ñëw bu baax' : 'Excellent',
          ),
        ],
      ),
    );
  }

  Widget _buildSpecItem(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Icon(
              icon,
              size: 20.0,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          const SizedBox(width: 12.0),
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const Spacer(),
          Text(
            value,
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildReviewCard(ReviewData review) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(
          color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.2),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                child: Text(
                  review.userName[0],
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Row(
                      children: [
                        ...List.generate(
                          5,
                          (index) => Icon(
                            index < review.rating.floor()
                                ? Icons.star
                                : Icons.star_border,
                            size: 16.0,
                            color: const Color(0xffffda79),
                          ),
                        ),
                        const SizedBox(width: 8.0),
                        Text(
                          '${review.date.day}/${review.date.month}/${review.date.year}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          Text(review.comment, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ),
    );
  }

  Widget _buildMainInfo(bool isWolof) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  widget.tractor.name,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 6.0,
                ),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(20.0),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.location_on,
                      size: 16.0,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 4.0),
                    Text(
                      '${widget.tractor.distance.toStringAsFixed(1)} km',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 12.0,
              vertical: 6.0,
            ),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.secondaryContainer,
              borderRadius: BorderRadius.circular(20.0),
            ),
            child: Text(
              isWolof
                  ? widget.tractor.serviceTypeWolof
                  : widget.tractor.serviceType,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
          ),
          const SizedBox(height: 12.0),
          Row(
            children: [
              const Icon(Icons.star, color: Color(0xffffda79), size: 20.0),
              const SizedBox(width: 4.0),
              Text(
                widget.tractor.rating.toString(),
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              Text(
                ' (${widget.tractor.reviewsCount} ${isWolof ? 'commentaires' : 'avis'})',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.secondary,
                ],
              ),
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Row(
              children: [
                const Icon(Icons.landscape, color: Colors.white, size: 32.0),
                const SizedBox(width: 12.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isWolof ? 'Njënd ci benn hektaar' : 'Tarif par hectare',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14.0,
                        ),
                      ),
                      const SizedBox(height: 4.0),
                      Text(
                        '${widget.tractor.pricePerHectare.toStringAsFixed(0)} FCFA',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 28.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: const Text(
                    '/ha',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOwnerInfo(bool isWolof) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            isWolof ? 'Boroom bi' : 'Propriétaire',
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16.0),
          Row(
            children: [
              Container(
                width: 60.0,
                height: 60.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.secondary,
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person,
                  color: Colors.white,
                  size: 30.0,
                ),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.tractor.owner,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.star,
                          color: Color(0xffffda79),
                          size: 16.0,
                        ),
                        const SizedBox(width: 4.0),
                        Text(
                          '4.9 • 45 ${isWolof ? 'services' : 'services'}',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              OutlinedButton.icon(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: Text(
                        isWolof ? 'Woote boroom bi' : 'Appeler le propriétaire',
                      ),
                      content: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.phone,
                            size: 48.0,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(height: 16.0),
                          Text(
                            '+221 77 xxx xx xx',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            widget.tractor.owner,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: Text(isWolof ? 'Deedeet' : 'Annuler'),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  isWolof
                                      ? 'Daldi woon...'
                                      : 'Appel en cours...',
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                          ),
                          icon: const Icon(Icons.phone),
                          label: Text(isWolof ? 'Woote' : 'Appeler'),
                        ),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.phone),
                label: Text(isWolof ? 'Woote' : 'Appeler'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Theme.of(context).colorScheme.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReviews(bool isWolof) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isWolof ? 'Commentaires' : 'Avis',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    backgroundColor: Colors.transparent,
                    isScrollControlled: true,
                    builder: (context) => Container(
                      height: MediaQuery.of(context).size.height * 0.8,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.surface,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(24.0),
                        ),
                      ),
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Center(
                            child: Container(
                              width: 40.0,
                              height: 4.0,
                              decoration: BoxDecoration(
                                color: Theme.of(
                                  context,
                                ).colorScheme.outlineVariant,
                                borderRadius: BorderRadius.circular(2.0),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24.0),
                          Text(
                            isWolof ? 'Lépp ay commentaires' : 'Tous les avis',
                            style: Theme.of(context)
                                .textTheme
                                .titleLarge
                                ?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16.0),
                          Row(
                            children: [
                              const Icon(
                                Icons.star,
                                color: Color(0xffffda79),
                                size: 32.0,
                              ),
                              const SizedBox(width: 8.0),
                              Text(
                                widget.tractor.rating.toString(),
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                              Text(
                                ' / 5.0',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              const Spacer(),
                              Text(
                                '${widget.tractor.reviewsCount} ${isWolof ? 'commentaires' : 'avis'}',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ),
                          const SizedBox(height: 24.0),
                          Expanded(
                            child: ListView.builder(
                              itemCount: _reviews.length,
                              itemBuilder: (context, index) =>
                                  _buildReviewCard(_reviews[index]),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
                child: Text(isWolof ? 'Gis lépp' : 'Voir tout'),
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          ..._reviews.map((review) => _buildReviewCard(review)),
        ],
      ),
    );
  }

  Widget _buildSliverAppBar(bool isWolof) {
    return SliverAppBar(
      expandedHeight: 300.0,
      pinned: true,
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8.0),
          decoration: BoxDecoration(
            color: Colors.black.withValues(alpha: 0.5),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.arrow_back, color: Colors.white),
        ),
        onPressed: () => Navigator.pop(context),
      ),
      actions: [
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: _isFavorite
                  ? const Color(0xffe56d4b).withValues(alpha: 0.9)
                  : Colors.black.withValues(alpha: 0.5),
              shape: BoxShape.circle,
              boxShadow: _isFavorite
                  ? [
                      BoxShadow(
                        color: const Color(0xffe56d4b).withValues(alpha: 0.5),
                        blurRadius: 12.0,
                        spreadRadius: 2.0,
                      ),
                    ]
                  : null,
            ),
            child: Icon(
              _isFavorite ? Icons.favorite : Icons.favorite_border,
              color: Colors.white,
            ),
          ),
          onPressed: () {
            setState(() {
              _isFavorite = !_isFavorite;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  _isFavorite
                      ? (isWolof ? 'Yokk ci favoris' : 'Ajouté aux favoris')
                      : (isWolof ? 'Dindi ci favoris' : 'Retiré des favoris'),
                ),
                backgroundColor:
                    _isFavorite ? const Color(0xffe56d4b) : Colors.grey,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                duration: const Duration(seconds: 2),
              ),
            );
          },
        ),
        IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.5),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.share, color: Colors.white),
          ),
          onPressed: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: Colors.transparent,
              builder: (context) => Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.surface,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(24.0),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 20.0,
                      offset: const Offset(0.0, -5.0),
                    ),
                  ],
                ),
                padding: EdgeInsets.fromLTRB(
                  24.0,
                  24.0,
                  24.0,
                  24.0 + MediaQuery.of(context).padding.bottom,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 40.0,
                      height: 4.0,
                      margin: const EdgeInsets.only(bottom: 20.0),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.outlineVariant,
                        borderRadius: BorderRadius.circular(2.0),
                      ),
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10.0),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [
                                Color(0xffe56d4b),
                                Color(0xfff19066),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12.0),
                          ),
                          child: const Icon(
                            Icons.share,
                            color: Colors.white,
                            size: 24.0,
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        Text(
                          isWolof ? 'Tàkku' : 'Partager',
                          style: Theme.of(context)
                              .textTheme
                              .titleLarge
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24.0),
                    Wrap(
                      spacing: 16.0,
                      runSpacing: 16.0,
                      alignment: WrapAlignment.center,
                      children: [
                        _buildShareOption(
                          Icons.message,
                          'WhatsApp',
                          false,
                          isWolof,
                        ),
                        _buildShareOption(
                          Icons.facebook,
                          'Facebook',
                          false,
                          isWolof,
                        ),
                        _buildShareOption(
                          Icons.link,
                          'Copier lien',
                          true,
                          isWolof,
                        ),
                        _buildShareOption(
                          Icons.more_horiz,
                          'Autre',
                          false,
                          isWolof,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            PageView.builder(
              itemCount: _tractorImages.length,
              onPageChanged: (index) {
                setState(() {
                  _currentImageIndex = index;
                });
              },
              itemBuilder: (context, index) => Image.network(
                _tractorImages[index],
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                  child: Icon(
                    Icons.agriculture,
                    size: 100.0,
                    color: Theme.of(
                      context,
                    ).colorScheme.primary.withValues(alpha: 0.3),
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 0.0,
              left: 0.0,
              right: 0.0,
              child: Container(
                height: 100.0,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.7),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 16.0,
              left: 0.0,
              right: 0.0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _tractorImages.length,
                  (index) => Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4.0),
                    width: _currentImageIndex == index ? 24.0 : 8.0,
                    height: 8.0,
                    decoration: BoxDecoration(
                      color: _currentImageIndex == index
                          ? Colors.white
                          : Colors.white.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(4.0),
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 60.0,
              right: 16.0,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 8.0,
                ),
                decoration: BoxDecoration(
                  color: widget.tractor.available
                      ? const Color(0xff2d5016)
                      : Colors.grey,
                  borderRadius: BorderRadius.circular(20.0),
                  boxShadow: [
                    BoxShadow(
                      color: (widget.tractor.available
                              ? const Color(0xff2d5016)
                              : Colors.grey)
                          .withValues(alpha: 0.3),
                      blurRadius: 8.0,
                      offset: const Offset(0.0, 2.0),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8.0,
                      height: 8.0,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    Text(
                      widget.tractor.available
                          ? (isWolof ? 'Jëkk' : 'Disponible')
                          : (isWolof ? 'Amul' : 'Occupé'),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShareOption(
    IconData icon,
    String label,
    bool isCopyLink,
    bool isWolof,
  ) {
    return InkWell(
      onTap: () {
        Navigator.pop(context);
        if (isCopyLink) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.white),
                  const SizedBox(width: 8.0),
                  Text(isWolof ? 'Lien kopiye !' : 'Lien copié !'),
                ],
              ),
              backgroundColor: const Color(0xff4caf50),
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              duration: const Duration(seconds: 2),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${isWolof ? 'Tàkku ci' : 'Partagé via'} $label'),
              backgroundColor: Theme.of(context).colorScheme.primary,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      },
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isCopyLink
                    ? [const Color(0xff4caf50), const Color(0xff66bb6a)]
                    : [
                        Theme.of(
                          context,
                        ).colorScheme.primary.withValues(alpha: 0.2),
                        Theme.of(
                          context,
                        ).colorScheme.secondary.withValues(alpha: 0.1),
                      ],
              ),
              border: Border.all(
                color: isCopyLink
                    ? const Color(0xff4caf50)
                    : Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.3),
              ),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: isCopyLink
                  ? Colors.white
                  : Theme.of(context).colorScheme.primary,
              size: 32.0,
            ),
          ),
          const SizedBox(height: 8.0),
          Text(
            label,
            style: Theme.of(
              context,
            ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildAvailabilityCalendar(bool isWolof) {
    final now = DateTime.now();
    final firstDayOfMonth = DateTime(now.year, now.month, 1);
    final lastDayOfMonth = DateTime(now.year, now.month + 1, 0);
    final daysInMonth = lastDayOfMonth.day;
    final startWeekday = firstDayOfMonth.weekday;
    final List<DateTime> bookedDates = [
      now.add(const Duration(days: 3)),
      now.add(const Duration(days: 7)),
      now.add(const Duration(days: 12)),
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xffe56d4b), Color(0xfff19066)],
                  ),
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: const Icon(
                  Icons.calendar_month,
                  color: Colors.white,
                  size: 24.0,
                ),
              ),
              const SizedBox(width: 12.0),
              Text(
                isWolof ? 'Disponibilité' : 'Disponibilité',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Theme.of(
                    context,
                  ).colorScheme.primaryContainer.withValues(alpha: 0.3),
                  Theme.of(
                    context,
                  ).colorScheme.secondaryContainer.withValues(alpha: 0.2),
                ],
              ),
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(
                color: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.2),
              ),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${_getMonthName(now.month, isWolof)} ${now.year}',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chevron_left),
                          onPressed: () {},
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                        const SizedBox(width: 8.0),
                        IconButton(
                          icon: const Icon(Icons.chevron_right),
                          onPressed: () {},
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: ['L', 'M', 'M', 'J', 'V', 'S', 'D']
                      .map(
                        (day) => SizedBox(
                          width: 40.0,
                          child: Text(
                            day,
                            textAlign: TextAlign.center,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.onSurfaceVariant,
                                    ),
                          ),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 8.0),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    childAspectRatio: 1.0,
                  ),
                  itemCount: 42,
                  itemBuilder: (context, index) {
                    final dayOffset = index - (startWeekday - 1);
                    if (dayOffset < 0 || dayOffset >= daysInMonth) {
                      return const SizedBox();
                    }
                    final day = dayOffset + 1;
                    final currentDate = DateTime(now.year, now.month, day);
                    final isToday = day == now.day;
                    final isSelected = _selectedDate?.day == day &&
                        _selectedDate?.month == now.month &&
                        _selectedDate?.year == now.year;
                    final isBooked = bookedDates.any(
                      (date) => date.day == day && date.month == now.month,
                    );
                    final isPast = currentDate.isBefore(
                      DateTime(now.year, now.month, now.day),
                    );
                    return GestureDetector(
                      onTap: isPast || isBooked
                          ? null
                          : () {
                              setState(() {
                                _selectedDate = currentDate;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    isWolof
                                        ? 'Bés tann na: $day/${now.month}/${now.year}'
                                        : 'Date sélectionnée: $day/${now.month}/${now.year}',
                                  ),
                                  backgroundColor: const Color(0xff4caf50),
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  duration: const Duration(seconds: 2),
                                ),
                              );
                            },
                      child: Container(
                        margin: const EdgeInsets.all(2.0),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xffe56d4b)
                              : isBooked
                                  ? Colors.grey.withValues(alpha: 0.3)
                                  : isPast
                                      ? Colors.transparent
                                      : Theme.of(context).colorScheme.surface,
                          borderRadius: BorderRadius.circular(8.0),
                          border: isToday
                              ? Border.all(
                                  color: const Color(0xffe56d4b),
                                  width: 2.0,
                                )
                              : null,
                        ),
                        child: Center(
                          child: Text(
                            day.toString(),
                            style: TextStyle(
                              color: isSelected
                                  ? Colors.white
                                  : isPast
                                      ? Theme.of(context)
                                          .colorScheme
                                          .onSurfaceVariant
                                          .withValues(alpha: 0.3)
                                      : isBooked
                                          ? Theme.of(context)
                                              .colorScheme
                                              .onSurfaceVariant
                                              .withValues(alpha: 0.5)
                                          : Theme.of(context)
                                              .colorScheme
                                              .onSurface,
                              fontWeight: isSelected || isToday
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              fontSize: 14.0,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16.0),
                Wrap(
                  spacing: 16.0,
                  runSpacing: 8.0,
                  children: [
                    _buildCalendarLegend(
                      Icons.circle,
                      isWolof ? 'Jooy' : 'Aujourd\'hui',
                      const Color(0xffe56d4b),
                      isWolof,
                    ),
                    _buildCalendarLegend(
                      Icons.check_circle,
                      isWolof ? 'Tann na' : 'Sélectionné',
                      const Color(0xffe56d4b),
                      isWolof,
                    ),
                    _buildCalendarLegend(
                      Icons.cancel,
                      isWolof ? 'Res na' : 'Réservé',
                      Colors.grey,
                      isWolof,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarLegend(
    IconData icon,
    String label,
    Color color,
    bool isWolof,
  ) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16.0, color: color),
        const SizedBox(width: 4.0),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }

  String _getMonthName(int month, bool isWolof) {
    if (isWolof) {
      const wolofMonths = [
        'Jànwiyee',
        'Fewriyee',
        'Mars',
        'Awril',
        'Mee',
        'Suwe',
        'Sulet',
        'Ut',
        'Sàttumbar',
        'Oktoobar',
        'Nowàmbar',
        'Desàmbar',
      ];
      return wolofMonths[month - 1];
    }
    const frenchMonths = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    return frenchMonths[month - 1];
  }

  Widget _buildBottomBar(bool isWolof) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10.0,
            offset: const Offset(0.0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ReservationScreen(
                    tractor: widget.tractor,
                    language: widget.language,
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              disabledBackgroundColor: Theme.of(
                context,
              ).colorScheme.primary.withValues(alpha: 0.5),
            ),
            child: Text(
              isWolof ? 'Res jooy' : 'Réserver maintenant',
              style: const TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
