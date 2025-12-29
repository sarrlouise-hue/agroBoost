// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
class TractorsManagementScreen extends StatelessWidget {
    const TractorsManagementScreen({
    required this.language,
    this.showBackButton = false,
    super.key,
  });

  final String language;

  final bool showBackButton;

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    final List<Map<String, dynamic>> tractors = [
      {
        'name': 'John Deere 5065E',
        'owner': 'Moussa Diop',
        'price': 40000,
        'status': 'approved',
        'type': 'Labour',
      },
      {
        'name': 'Massey Ferguson 385',
        'owner': 'Fatou Sall',
        'price': 35000,
        'status': 'approved',
        'type': 'Offset',
      },
      {
        'name': 'New Holland TD5',
        'owner': 'Ibrahima Ndiaye',
        'price': 30000,
        'status': 'pending',
        'type': 'Reprofilage',
      },
    ];
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surface,
      appBar: AppBar(
        automaticallyImplyLeading: showBackButton,
        elevation: 0.0,
        backgroundColor: Theme.of(context).colorScheme.surface,
        leading: showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back_rounded),
                onPressed: () => Navigator.pop(context),
              )
            : null,
        title: Text(
          isWolof ? 'Traktëëur yi' : 'Gestion Tracteurs',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                      vertical: 4.0,
                    ),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: isWolof ? 'Seet...' : 'Rechercher...',
                        border: InputBorder.none,
                        prefixIcon: const Icon(Icons.search_rounded),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12.0),
                IconButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          isWolof
                              ? 'Filtrer les tracteurs'
                              : 'Filtrer les tracteurs',
                        ),
                        duration: const Duration(seconds: 2),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                  icon: const Icon(Icons.filter_list_rounded),
                  style: IconButton.styleFrom(
                    backgroundColor: const Color(0xfffdd979),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: tractors.length,
              itemBuilder: (context, index) {
                final Map<String, dynamic> tractor = tractors[index];
                final bool isApproved = tractor['status'] == 'approved';
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(bottom: 16.0),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surface,
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 8.0,
                        offset: const Offset(0.0, 2.0),
                      ),
                      BoxShadow(
                        color: Colors.black.withOpacity(0.02),
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
                                  ? 'Voir les détails de ${tractor['name']}'
                                  : 'Voir les détails de ${tractor['name']}',
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 60.0,
                                  height: 60.0,
                                  decoration: BoxDecoration(
                                    color: const Color(0xfffdd979),
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  child: const Icon(
                                    Icons.agriculture_rounded,
                                    size: 32.0,
                                    color: Color(0xffed6a4c),
                                  ),
                                ),
                                const SizedBox(width: 16.0),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        tractor['name'] as String,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16.0,
                                        ),
                                      ),
                                      const SizedBox(height: 4.0),
                                      Text(
                                        tractor['owner'] as String,
                                        style: Theme.of(
                                          context,
                                        ).textTheme.bodySmall,
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12.0,
                                    vertical: 6.0,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isApproved
                                        ? const Color(
                                            0xff4caf50,
                                          ).withOpacity(0.1)
                                        : const Color(
                                            0xffff9800,
                                          ).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  child: Text(
                                    isApproved
                                        ? (isWolof ? 'Approuvé' : 'Approuvé')
                                        : (isWolof
                                            ? 'En attente'
                                            : 'En attente'),
                                    style: TextStyle(
                                      fontSize: 11.0,
                                      fontWeight: FontWeight.bold,
                                      color: isApproved
                                          ? const Color(0xff4caf50)
                                          : const Color(0xffff9800),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12.0),
                            Row(
                              children: [
                                Chip(
                                  label: Text(
                                    tractor['type'] as String,
                                    style: const TextStyle(fontSize: 12.0),
                                  ),
                                  backgroundColor: const Color(
                                    0xfffdd979,
                                  ).withOpacity(0.5),
                                ),
                                const SizedBox(width: 8.0),
                                Text(
                                  '${tractor['price']} F/ha',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xffed6a4c),
                                  ),
                                ),
                                const Spacer(),
                                if (!isApproved) ...[
                                  IconButton(
                                    onPressed: () {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            isWolof
                                                ? '${tractor['name']} approuvé ✓'
                                                : '${tractor['name']} approuvé ✓',
                                          ),
                                          duration: const Duration(seconds: 2),
                                          backgroundColor: const Color(
                                            0xff4caf50,
                                          ),
                                          behavior: SnackBarBehavior.floating,
                                        ),
                                      );
                                    },
                                    icon: const Icon(
                                      Icons.check_rounded,
                                      color: Color(0xff4caf50),
                                    ),
                                    tooltip:
                                        isWolof ? 'Approuver' : 'Approuver',
                                  ),
                                  IconButton(
                                    onPressed: () {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            isWolof
                                                ? '${tractor['name']} refusé'
                                                : '${tractor['name']} refusé',
                                          ),
                                          duration: const Duration(seconds: 2),
                                          backgroundColor: const Color(
                                            0xfff44336,
                                          ),
                                          behavior: SnackBarBehavior.floating,
                                        ),
                                      );
                                    },
                                    icon: const Icon(
                                      Icons.close_rounded,
                                      color: Color(0xfff44336),
                                    ),
                                    tooltip: isWolof ? 'Refuser' : 'Refuser',
                                  ),
                                ],
                              ],
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
