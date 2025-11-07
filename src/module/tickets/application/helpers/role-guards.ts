// Small runtime guards to detect objects that expose role helper methods
export const hasIsAdmin = (r: unknown): r is { isAdmin: () => boolean } => {
  return !!r && typeof (r as any).isAdmin === 'function';
};

export const hasIsAreaManager = (
  r: unknown,
): r is { isAreaManager: () => boolean } => {
  return !!r && typeof (r as any).isAreaManager === 'function';
};
