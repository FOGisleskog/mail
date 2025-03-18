from django.contrib import admin
from .models import Email


# Register the Email model in the admin panel
@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    # Display fields in the list view of the Email model in the admin page
    list_display = ('id', 'subject', 'sender', 'timestamp', 'read', 'archived')
    
    # Add search functionality to search by subject, sender email, or body
    search_fields = ('subject', 'sender__email', 'body', 'recipients__email')
    
    # Add filters for read and archived status
    list_filter = ('read', 'archived')

    # Optionally, you can add custom actions to the admin page
    actions = ['mark_as_read', 'archive_email']

    def mark_as_read(self, request, queryset):
        queryset.update(read=True)
    mark_as_read.short_description = "Mark selected emails as read"

    def archive_email(self, request, queryset):
        queryset.update(archived=True)
    archive_email.short_description = "Archive selected emails"