function hasPermission(member, allowedRoleIds = []) {
    if (!member || !allowedRoleIds.length) return true;
    return member.roles.cache.some(role => allowedRoleIds.includes(role.id));
}

function hasPermissionHierarchy(member, requiredRoles = []) {
    if (!member || !requiredRoles.length) return true;

    const memberRoles = member.roles.cache.map(r => r.id);

    return requiredRoles.some(roleId => memberRoles.includes(roleId));
}

function permissionMessage() {
    return 'You do not have permission to use this.';
}

function permissionReply(options = {}) {
    return {
        content: permissionMessage(),
        ephemeral: options.ephemeral ?? true
    };
}

function permissionEmbed(color = 0xff0000) {
    return {
        embeds: [
            {
                color,
                description: permissionMessage()
            }
        ],
        ephemeral: true
    };
}

module.exports = {
    hasPermission,
    hasPermissionHierarchy,
    permissionMessage,
    permissionReply,
    permissionEmbed
};