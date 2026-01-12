import 'package:flutter/material.dart';
import 'package:hallo/maintenance_record.dart';
class MaintenanceRecordDetailSheet extends StatelessWidget {
    const MaintenanceRecordDetailSheet({
    required this.record,
    required this.language,
    this.onEdit,
    this.onDelete,
    super.key,
  });

  final MaintenanceRecord record;

  final String language;

  final Function(MaintenanceRecord)? onEdit;

  final Function(String)? onDelete;

  Widget _buildDetailRow(
    BuildContext context,
    IconData icon,
    String label,
    String value,
  ) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Icon(icon, size: 20.0, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 12.0),
          Text(
            '$label:',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
          ),
          const SizedBox(width: 8.0),
          Expanded(
            child: Text(
              value,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isWolof = language == 'wo';
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 12.0),
            width: 40.0,
            height: 4.0,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.outline,
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24.0, 16.0, 24.0, 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          record.title,
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(fontWeight: FontWeight.bold),
                        ),
                      ),
                      if (onEdit != null || onDelete != null)
                        PopupMenuButton<String>(
                          icon: Icon(
                            Icons.more_vert,
                            color: Theme.of(context).colorScheme.onSurface,
                          ),
                          onSelected: (value) {
                            if (value == 'edit' && onEdit != null) {
                              Navigator.pop(context);
                              onEdit?.call(record);
                            } else {
                              if (value == 'delete' && onDelete != null) {
                                Navigator.pop(context);
                                _confirmDelete(context, isWolof);
                              }
                            }
                          },
                          itemBuilder: (context) => [
                            if (onEdit != null)
                              PopupMenuItem(
                                value: 'edit',
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.edit,
                                      size: 20.0,
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.primary,
                                    ),
                                    const SizedBox(width: 12.0),
                                    Text(isWolof ? 'Soppi' : 'Modifier'),
                                  ],
                                ),
                              ),
                            if (onDelete != null)
                              PopupMenuItem(
                                value: 'delete',
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.delete,
                                      size: 20.0,
                                      color: Colors.red,
                                    ),
                                    const SizedBox(width: 12.0),
                                    Text(
                                      isWolof ? 'Fey' : 'Supprimer',
                                      style: const TextStyle(color: Colors.red),
                                    ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                    ],
                  ),
                  const SizedBox(height: 24.0),
                  if (record.imageUrl != null) ...[
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16.0),
                      child: Image.network(
                        record.imageUrl!,
                        width: double.infinity,
                        height: 200.0,
                        fit: BoxFit.cover,
                      ),
                    ),
                    const SizedBox(height: 24.0),
                  ],
                  Text(
                    record.description,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 24.0),
                  _buildDetailRow(
                    context,
                    Icons.calendar_today,
                    isWolof ? 'Bës' : 'Date',
                    '${record.date.day}/${record.date.month}/${record.date.year}',
                  ),
                  _buildDetailRow(
                    context,
                    Icons.attach_money,
                    isWolof ? 'Njëg' : 'Coût',
                    '${record.cost.toStringAsFixed(0)} FCFA',
                  ),
                  _buildDetailRow(
                    context,
                    Icons.speed,
                    isWolof ? 'Waxtu motër' : 'Heures moteur',
                    '${record.engineHours} h',
                  ),
                  if (record.technician != null)
                    _buildDetailRow(
                      context,
                      Icons.person,
                      isWolof ? 'Teknisien' : 'Technicien',
                      record.technician!,
                    ),
                  if (record.partsReplaced.isNotEmpty) ...[
                    const SizedBox(height: 8.0),
                    Text(
                      isWolof ? 'Pièces yëpp' : 'Pièces remplacées',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8.0),
                    Wrap(
                      spacing: 8.0,
                      runSpacing: 8.0,
                      children: record.partsReplaced
                          .map(
                            (part) => Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12.0,
                                vertical: 6.0,
                              ),
                              decoration: BoxDecoration(
                                color: Theme.of(context)
                                    .colorScheme
                                    .primaryContainer
                                    .withValues(alpha: 0.5),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                part,
                                style: TextStyle(
                                  fontSize: 12.0,
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.onSurfaceVariant,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, bool isWolof) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(isWolof ? 'Fey entretien' : 'Supprimer l\'entretien'),
        content: Text(
          isWolof
              ? 'Ndax danga bëgg fey entretien bii?'
              : 'Êtes-vous sûr de vouloir supprimer cet entretien ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(isWolof ? 'Dëdd' : 'Annuler'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              if (onDelete != null) {
                onDelete?.call(record.id);
              }
            },
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: Text(isWolof ? 'Fey' : 'Supprimer'),
          ),
        ],
      ),
    );
  }
}
