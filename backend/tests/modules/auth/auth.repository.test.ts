import { AuthRepository } from '../../../src/modules/auth/auth.repository';
import User from '../../../models/User';

describe('AuthRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should call User.findOne with email', async () => {
      const mockUser = { email: 'test@example.com' };
      const findOneSpy = jest
        .spyOn(User, 'findOne')
        .mockResolvedValue(mockUser as any);
      const result = await AuthRepository.findByEmail('test@example.com');
      expect(findOneSpy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toBe(mockUser);
    });
  });

  describe('createUser', () => {
    it('should call User.create with data', async () => {
      const data = {
        email: 'test@example.com',
        password: 'pass',
        first_name: 'A',
        last_name: 'B',
      };
      const mockUser = { ...data };
      const createSpy = jest
        .spyOn(User, 'create')
        .mockResolvedValue(mockUser as any);
      const result = await AuthRepository.createUser(data as any);
      expect(createSpy).toHaveBeenCalledWith(data);
      expect(result).toBe(mockUser);
    });
  });

  describe('findById', () => {
    it('should call User.findById and select -password', async () => {
      const mockUserWithSelect = {
        _id: 'user123',
        select: jest.fn().mockResolvedValue('userNoPassword'),
      };
      const findByIdSpy = jest
        .spyOn(User, 'findById')
        .mockReturnValue(mockUserWithSelect as any);
      const result = await AuthRepository.findById('user123');
      expect(findByIdSpy).toHaveBeenCalledWith('user123');
      expect(mockUserWithSelect.select).toHaveBeenCalledWith('-password');
      expect(result).toBe('userNoPassword');
    });
  });

  describe('deleteUser', () => {
    it('should call User.findByIdAndDelete with id', async () => {
      const deleteSpy = jest
        .spyOn(User, 'findByIdAndDelete')
        .mockResolvedValue(true as any);
      const result = await AuthRepository.deleteUser('user123');
      expect(deleteSpy).toHaveBeenCalledWith('user123');
      expect(result).toBe(true);
    });
  });
});
