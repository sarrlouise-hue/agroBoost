class TractorData {
  TractorData({
    required this.id,
    required this.name,
    required this.owner,
    required this.pricePerHectare,
    required this.distance,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    required this.lat,
    required this.lng,
    required this.type,
    required this.available,
    required this.serviceType,
    required this.serviceTypeWolof,
  });

  final String id;

  final String name;

  final String owner;

  final double pricePerHectare;

  final double distance;

  final double rating;

  final int reviewsCount;

  final String imageUrl;

  final double lat;

  final double lng;

  final String type;

  final bool available;

  final String serviceType;

  final String serviceTypeWolof;
}
