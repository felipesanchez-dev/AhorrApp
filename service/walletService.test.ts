import { createOrUpdateWallet } from './walletService';
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from './imageService';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

// Mock the services
jest.mock('./imageService', () => ({
  uploadFileToCloudinary: jest.fn(),
  deleteFileFromCloudinary: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  getFirestore: jest.fn(() => ({})), // Mock getFirestore if it's used in firebase.ts
}));

// Mock the firestore config
jest.mock('@/config/firebase', () => ({
  firestore: {}, // Mock the exported firestore object
}));

const mockedUploadFile = uploadFileToCloudinary as jest.Mock;
const mockedDeleteFile = deleteFileFromCloudinary as jest.Mock;
const mockedGetDoc = getDoc as jest.Mock;
const mockedSetDoc = setDoc as jest.Mock;
const mockedDoc = doc as jest.Mock;
const mockedCollection = collection as jest.Mock;


describe('createOrUpdateWallet', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockedDoc.mockReturnValue({ id: 'new-wallet-id' } as any);
    mockedCollection.mockReturnValue({} as any);
  });

  it('should upload a new image and delete the old one when updating a wallet', async () => {
    const oldImageUrl = 'https://cloudinary.com/old_image.jpg';
    const newImageUrl = 'https://cloudinary.com/new_image.jpg';
    const walletId = 'existing-wallet-id';

    // Arrange: Mock that an old wallet exists with an image
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        id: walletId,
        name: 'Old Wallet',
        image: oldImageUrl,
      }),
    });

    // Arrange: Mock a successful new image upload
    mockedUploadFile.mockResolvedValue({
      success: true,
      data: newImageUrl,
    });

    // Arrange: Mock a successful image deletion
    mockedDeleteFile.mockResolvedValue({
        success: true,
    });


    const walletData = {
      id: walletId,
      name: 'Updated Wallet',
      image: { uri: 'local/path/to/new_image.jpg' }, // A new file object
    };

    // Act
    const result = await createOrUpdateWallet(walletData);

    // Assert
    expect(result.success).toBe(true);
    // Verify that the old wallet data was fetched
    expect(mockedGetDoc).toHaveBeenCalledWith(mockedDoc(undefined, "wallets", walletId));
    // Verify the new image was uploaded
    expect(mockedUploadFile).toHaveBeenCalledWith(walletData.image, 'wallets');
    // Verify the old image was deleted
    expect(mockedDeleteFile).toHaveBeenCalledWith(oldImageUrl);
    // Verify the wallet was saved with the new image URL
    expect(mockedSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ image: newImageUrl }),
      { merge: true }
    );
  });

  it('should NOT delete an image if the wallet is updated without a new image', async () => {
    const existingImageUrl = 'https://cloudinary.com/existing_image.jpg';
    const walletId = 'existing-wallet-id-2';

    // Arrange: Mock that a wallet exists
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        id: walletId,
        name: 'My Wallet',
        image: existingImageUrl,
      }),
    });

    const walletData = {
      id: walletId,
      name: 'My Wallet Updated Name',
      image: existingImageUrl, // Image is a string, not a file object
    };

    // Act
    await createOrUpdateWallet(walletData);

    // Assert
    expect(mockedUploadFile).not.toHaveBeenCalled();
    expect(mockedDeleteFile).not.toHaveBeenCalled();
    expect(mockedSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ image: existingImageUrl }), // The image URL should be unchanged
      { merge: true }
    );
  });

  it('should only upload an image and NOT delete when creating a new wallet', async () => {
    const newImageUrl = 'https://cloudinary.com/new_image.jpg';

    // Arrange: Mock a successful image upload
    mockedUploadFile.mockResolvedValue({
      success: true,
      data: newImageUrl,
    });

    const walletData = {
      // No 'id' means it's a new wallet
      name: 'New Wallet',
      image: { uri: 'local/path/to/new_image.jpg' }, // A new file object
    };

    // Act
    await createOrUpdateWallet(walletData);

    // Assert
    expect(mockedGetDoc).not.toHaveBeenCalled(); // Should not try to fetch an old wallet
    expect(mockedUploadFile).toHaveBeenCalledWith(walletData.image, 'wallets');
    expect(mockedDeleteFile).not.toHaveBeenCalled();
    expect(mockedSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ image: newImageUrl }),
      { merge: true }
    );
  });
});
