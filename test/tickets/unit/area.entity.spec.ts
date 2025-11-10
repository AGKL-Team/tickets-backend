import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { SubArea } from '../../../src/module/tickets/domain/models/sub-area.entity';

describe('Area entity', () => {
  it('creates with uppercase name and optional description', () => {
    const a = Area.create('soporte', 'Descripción');
    expect(a).toBeInstanceOf(Area);
    expect(a.name).toBe('SOPORTE');
    expect(a.description).toBe('Descripción');
  });

  it('changeName uppercases', () => {
    const a = Area.create('ventas');
    a.changeName('logistica');
    expect(a.name).toBe('LOGISTICA');
  });

  it('addSubArea adds subareas and prevents duplicates', () => {
    const a = Area.create('finanzas');
    const s1 = SubArea.create('cobros', 'desc', a);
    a.addSubArea(s1);
    expect(a.subAreas).toBeDefined();
    expect(a.subAreas.length).toBe(1);

    // adding same name should throw
    const s2 = SubArea.create('cobros', 'otra', a);
    expect(() => a.addSubArea(s2)).toThrow();
  });
});
