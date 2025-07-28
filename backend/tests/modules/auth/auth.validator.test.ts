import {
  SignupSchema,
  LoginSchema,
} from '../../../src/modules/auth/auth.validator';

describe('auth.validator', () => {
  describe('SignupSchema', () => {
    it('should validate a valid signup payload', () => {
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => SignupSchema.parse(data)).not.toThrow();
    });
    it('should fail if first_name is missing', () => {
      const data = {
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => SignupSchema.parse(data)).toThrow(/First name is required/);
    });
    it('should fail if last_name is missing', () => {
      const data = {
        first_name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => SignupSchema.parse(data)).toThrow(/Last name is required/);
    });
    it('should fail if email is invalid', () => {
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'not-an-email',
        password: 'password123',
      };
      expect(() => SignupSchema.parse(data)).toThrow(/Invalid email/);
    });
    it('should fail if password is too short', () => {
      const data = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: '123',
      };
      expect(() => SignupSchema.parse(data)).toThrow(/at least 6 characters/);
    });
  });

  describe('LoginSchema', () => {
    it('should validate a valid login payload', () => {
      const data = {
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => LoginSchema.parse(data)).not.toThrow();
    });
    it('should fail if email is missing', () => {
      const data = {
        password: 'password123',
      };
      expect(() => LoginSchema.parse(data)).toThrow();
    });
    it('should fail if password is missing', () => {
      const data = {
        email: 'john@example.com',
      };
      expect(() => LoginSchema.parse(data)).toThrow();
    });
  });
});
