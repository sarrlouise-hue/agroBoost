import 'dart:convert';
import 'package:flutter/material.dart';

class SafeImage extends StatelessWidget {
  final String imageUrl;
  final double? height;
  final double? width;
  final BoxFit fit;
  final Widget? errorWidget;

  const SafeImage({
    super.key,
    required this.imageUrl,
    this.height,
    this.width,
    this.fit = BoxFit.cover,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    String cleanUrl = imageUrl.trim();
    // Nettoyage des guillemets éventuels
    if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
      cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
    } else if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
      cleanUrl = cleanUrl.substring(1, cleanUrl.length - 1);
    }
    cleanUrl = cleanUrl.trim();

    final String base = 'https://agro-boost-ruddy.vercel.app';
    String fullUrl = cleanUrl;

    // Auto-fix for common backend development issue: localhost URLs
    if (cleanUrl.contains('localhost') || cleanUrl.contains('127.0.0.1')) {
      print(
          '⚠️ SafeImage: Replacing localhost/127.0.0.1 with production domain');
      fullUrl = cleanUrl
          .replaceAll('http://localhost:3001', base)
          .replaceAll('http://localhost:3000', base)
          .replaceAll('http://127.0.0.1:3001', base)
          .replaceAll('http://127.0.0.1:3000', base);
    }

    if (!fullUrl.startsWith('http') &&
        fullUrl.isNotEmpty &&
        fullUrl != 'null' &&
        fullUrl != 'NONE') {
      // If no slash at start, add it. Then check if we need /api/
      // Some images are served from root /, others from /api/
      // We'll assume root for now if it's /uploads
      if (fullUrl.startsWith('/uploads')) {
        fullUrl = '$base$fullUrl';
      } else {
        fullUrl = fullUrl.startsWith('/') ? '$base$fullUrl' : '$base/$fullUrl';
      }
    }

    return _buildActualImage(context, cleanUrl, fullUrl);
  }

  Widget _buildActualImage(
      BuildContext context, String cleanUrl, String fullUrl) {
    if (cleanUrl == 'null' || cleanUrl.isEmpty || cleanUrl == 'NONE') {
      return _buildErrorPlaceholder(context);
    }

    // Case 1: Base64 data URI (starts with data:image)
    if (cleanUrl.startsWith('data:image')) {
      try {
        final parts = cleanUrl.split(',');
        if (parts.length > 1) {
          final String base64String = parts.last.replaceAll(RegExp(r'\s+'), '');
          print('✅ SafeImage: Data URI Base64 decoded successfully');
          return Image.memory(
            base64Decode(base64String),
            height: height,
            width: width,
            fit: fit,
            errorBuilder: (c, e, s) {
              print('❌ SafeImage: Error rendering Memory image');
              return _buildErrorPlaceholder(c);
            },
          );
        }
      } catch (e) {
        print('❌ SafeImage: Base64 decoding error: $e');
        return _buildErrorPlaceholder(context);
      }
    }

    // Case 2: Raw Base64 (heuristic: no http, no slashes, very long)
    if (!cleanUrl.startsWith('http') &&
        !cleanUrl.startsWith('/') &&
        cleanUrl.length > 50) {
      try {
        final normalizedBase64 = cleanUrl.replaceAll(RegExp(r'\s+'), '');
        print('✅ SafeImage: Raw Base64 decoded successfully');
        return Image.memory(
          base64Decode(normalizedBase64),
          height: height,
          width: width,
          fit: fit,
          errorBuilder: (c, e, s) => _buildErrorPlaceholder(c),
        );
      } catch (e) {
        // Not actually base64, continue to network attempt
      }
    }

    // Case 3: Network Image
    print('🌐 SafeImage Network Attempt: $fullUrl');

    return Image.network(
      fullUrl,
      height: height,
      width: width,
      fit: fit,
      errorBuilder: (c, e, s) {
        print('❌ SafeImage Load Failed: $fullUrl');
        return _buildErrorPlaceholder(c);
      },
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Container(
          height: height,
          width: width ?? double.infinity,
          color: Colors.blue[50],
          child: Stack(
            alignment: Alignment.center,
            children: [
              CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                        loadingProgress.expectedTotalBytes!
                    : null,
                strokeWidth: 2,
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  color: Colors.blue[900],
                  child: Text(
                    'LOADING: ${fullUrl.length > 30 ? "${fullUrl.substring(0, 30)}..." : fullUrl}',
                    style: const TextStyle(color: Colors.white, fontSize: 8),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showErrorSnackBar(BuildContext context, String message) {
    // We use Future.microtask to avoid calling SnackBar during build
    Future.microtask(() {
      if (context.mounted) {
        // Commented out to avoid spamming UI, but available for extreme debug
        // ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
      }
    });
  }

  Widget _buildErrorPlaceholder(BuildContext context) {
    final bool isEmpty =
        imageUrl.isEmpty || imageUrl == 'null' || imageUrl == 'NONE';

    return Container(
      height: height,
      width: width ?? double.infinity,
      decoration: BoxDecoration(
        color: isEmpty ? Colors.grey[100] : Colors.red[50],
        border:
            Border.all(color: isEmpty ? Colors.grey[300]! : Colors.red[200]!),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isEmpty ? Icons.agriculture : Icons.broken_image,
                size: (height ?? 50) * 0.3,
                color: isEmpty ? Colors.grey[400] : Colors.red[300],
              ),
              if (!isEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  'Erreur de chargement',
                  style: TextStyle(
                    color: Colors.red[700],
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ],
          ),
          if (!isEmpty)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 8),
                color: Colors.red[900]?.withValues(alpha: 0.8),
                child: Text(
                  imageUrl.length > 30
                      ? '${imageUrl.substring(0, 30)}...'
                      : imageUrl,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 8,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
