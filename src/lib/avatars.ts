export const avatarIds=['fox','cat','frog','owl','panda','bunny'] as const;
export type AvatarId=typeof avatarIds[number];
export function validAvatar(value:unknown):AvatarId|undefined {return avatarIds.find(id=>id===value);}