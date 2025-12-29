import 'package:flutter/material.dart';
import 'package:allotracteur/maintenance_record.dart';

class MaintenanceRecordDetailSheet extends StatelessWidget {
  const MaintenanceRecordDetailSheet({
    super.key,
    required this.record,
    required this.language,
  });

  final MaintenanceRecord record;

  final String language;

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
                  Text(
                    record.title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
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
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

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
}
