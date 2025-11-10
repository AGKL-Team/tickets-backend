import { ObjectId } from 'mongodb';

export function toObjectId(id: any): any {
  if (!id) return id;
  // If it's already an ObjectId, return as-is
  if (id instanceof ObjectId) return id;
  try {
    return new ObjectId(id);
  } catch {
    // Not a valid ObjectId string, return original value
    return id;
  }
}
