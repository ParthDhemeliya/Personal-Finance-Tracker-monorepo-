import { getCategories } from '../../../src/modules/category/category.controller';
import Category from '../../../models/Category';

describe('category.controller', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return categories', async () => {
    const categories = [{ _id: 'c1', name: 'Food' }];
    jest.spyOn(Category, 'find').mockResolvedValue(categories as any);
    await getCategories(req, res, next);
    expect(Category.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(categories);
  });

  it('should call next on error', async () => {
    jest.spyOn(Category, 'find').mockRejectedValue(new Error('fail'));
    await getCategories(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
