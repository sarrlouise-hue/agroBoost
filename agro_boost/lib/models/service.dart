class AgriculturalService {
  final String id;
  final String name;
  final double pricePerHour;
  final String? image;
  final String description;
  final double rating;
  final int reviewCount;

  AgriculturalService({
    required this.id,
    required this.name,
    required this.pricePerHour,
    this.image,
    this.description = '',
    this.rating = 0.0,
    this.reviewCount = 0,
  });
}
