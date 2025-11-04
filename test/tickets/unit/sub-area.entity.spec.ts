import { Area } from '../../../src/module/tickets/domain/models/area.entity';
import { SubArea } from '../../../src/module/tickets/domain/models/sub-area.entity';

describe('SubArea entity', () => {
  it('create uppercases name and assigns area', () => {
    const area = Area.create('soporte');
    const s = SubArea.create('cobros', 'desc', area);
    expect(s).toBeInstanceOf(SubArea);
    expect(s.name).toBe('COBROS');
    expect(s.area).toBe(area);
  });

  it('changeName uppercases and changeDescription updates', () => {
    const area = Area.create('ventas');
    const s = SubArea.create('gestion', '', area);
    s.changeName('operaciones');
    expect(s.name).toBe('OPERACIONES');
    s.changeDescription('nueva');
    expect(s.description).toBe('nueva');
  });

  it('changeArea updates the associated area', () => {
    const a1 = Area.create('uno');
    const a2 = Area.create('dos');
    const s = SubArea.create('sa', '', a1);
    s.changeArea(a2);
    expect(s.area).toBe(a2);
  });
});
