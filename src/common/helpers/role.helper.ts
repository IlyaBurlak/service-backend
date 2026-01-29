export function isAdmin(userRole: string | undefined): boolean {
  return userRole === 'ADMIN';
}

export function canModifyResource(
  requesterId: number,
  resourceOwnerId: number,
  requesterRole: string | undefined,
): boolean {
  // Админ может модифицировать любые ресурсы
  if (isAdmin(requesterRole)) {
    return true;
  }
  // Обычный пользователь может модифицировать только свои ресурсы
  return requesterId === resourceOwnerId;
}

