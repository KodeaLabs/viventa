# Generated migration for FSMField status

from django.db import migrations
import django_fsm


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0004_add_approval_workflow'),
    ]

    operations = [
        # Change status field to FSMField with protected=True
        migrations.AlterField(
            model_name='property',
            name='status',
            field=django_fsm.FSMField(
                choices=[
                    ('draft', 'Borrador'),
                    ('pending_review', 'En Revisión'),
                    ('active', 'Activa'),
                    ('rejected', 'Rechazada'),
                    ('inactive', 'Desactivada'),
                    ('sold', 'Vendida'),
                    ('rented', 'Alquilada'),
                ],
                default='draft',
                max_length=20,
                protected=True,
            ),
        ),
        # Add custom permission for approving/rejecting properties
        migrations.AlterModelOptions(
            name='property',
            options={
                'ordering': ['-created_at'],
                'permissions': [
                    ('can_approve_property', 'Can approve/reject property listings'),
                ],
                'verbose_name': 'Property',
                'verbose_name_plural': 'Properties',
            },
        ),
    ]
