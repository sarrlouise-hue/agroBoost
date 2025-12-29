import 'package:flutter/material.dart';
class UsersManagementScreen extends StatelessWidget {
    const UsersManagementScreen({required this.language, super.key});

  final String language;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    final users = [
      {
        'name': 'Fatou Sall',
        'type': 'Producteur',
        'phone': '+221 77 123 45 67',
        'status': 'active',
        'date': '10/12/2024',
      },
      {
        'name': 'Moussa Diop',
        'type': 'Prestataire',
        'phone': '+221 76 234 56 78',
        'status': 'active',
        'date': '08/12/2024',
      },
      {
        'name': 'Ibrahima Ndiaye',
        'type': 'Producteur',
        'phone': '+221 77 345 67 89',
        'status': 'pending',
        'date': '12/12/2024',
      },
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        elevation: 0.0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        title: Text(
          isWolof ? 'Jëfandikukat' : 'Gestion Utilisateurs',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.fromLTRB(24.0, 8.0, 24.0, 20.0),
            padding: const EdgeInsets.symmetric(
              horizontal: 20.0,
              vertical: 4.0,
            ),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(14.0),
            ),
            child: TextField(
              decoration: InputDecoration(
                hintText: isWolof ? 'Seet...' : 'Rechercher...',
                hintStyle: TextStyle(
                  color: Theme.of(
                    context,
                  ).colorScheme.onSurfaceVariant.withValues(alpha: 0.6),
                ),
                border: InputBorder.none,
                prefixIcon: Icon(
                  Icons.search_rounded,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                final isActive = user['status'] == 'active';
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(bottom: 16.0),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 8.0,
                        offset: const Offset(0.0, 2.0),
                      ),
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 2.0,
                        offset: const Offset(0.0, 1.0),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16.0),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              isWolof
                                  ? 'Ouvrir le profil de ${user['name']}'
                                  : 'Ouvrir le profil de ${user['name']}',
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Row(
                          children: [
                            Container(
                              width: 56.0,
                              height: 56.0,
                              decoration: const BoxDecoration(
                                color: Color(0xffef8961),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.person_rounded,
                                color: Colors.white,
                                size: 28.0,
                              ),
                            ),
                            const SizedBox(width: 16.0),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    user['name'] as String,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16.0,
                                    ),
                                  ),
                                  const SizedBox(height: 6.0),
                                  Row(
                                    children: [
                                      Text(
                                        '${user['type']} • ',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodySmall
                                            ?.copyWith(
                                              color: Theme.of(
                                                context,
                                              ).colorScheme.onSurfaceVariant,
                                            ),
                                      ),
                                      Expanded(
                                        child: Text(
                                          user['phone'] as String,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall
                                              ?.copyWith(
                                                color: Theme.of(
                                                  context,
                                                ).colorScheme.onSurfaceVariant,
                                              ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12.0,
                                vertical: 8.0,
                              ),
                              decoration: BoxDecoration(
                                color: isActive
                                    ? const Color(
                                        0xff4caf50,
                                      ).withValues(alpha: 0.1)
                                    : const Color(
                                        0xffff9800,
                                      ).withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              child: Text(
                                isActive
                                    ? (isWolof ? 'Actif' : 'Actif')
                                    : (isWolof ? 'En attente' : 'En attente'),
                                style: TextStyle(
                                  fontSize: 12.0,
                                  fontWeight: FontWeight.bold,
                                  color: isActive
                                      ? const Color(0xff4caf50)
                                      : const Color(0xffff9800),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
