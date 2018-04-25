package com.hust.mem.util;


import org.springframework.security.crypto.codec.Hex;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

/**
 * Created by huangzw on 2016/6/30.
 * <p>
 * 处理密码加密、密码匹配。加密方法为PBKDF2。<br/>
 * 基本原理为
 */
public class PasswordHashUtil {


    private static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";

    /**
     * 以下参数为加密相关参数，这些参数会被存在每次加密后的结果中，更改它们不会影响以前已经加密过的密码的解密。
     */
    private static final int SALT_BYTE_SIZE = 24;
    private static final int HASH_BYTE_SIZE = 24;
    private static final int PBKDF2_ITERATIONS = 1000;

    /**
     * 以下参数指定加密参数在最终字符串中的存储位置。
     * 如果要修改请一并修改{@link #createHash(char[])}方法。
     */
    private static final int ITERATION_INDEX = 0;
    private static final int SALT_INDEX = 1;
    private static final int PBKDF2_INDEX = 2;

    /**
     * 返回一个加密后的HASH值。<br/>
     * 格式如下<br/>
     * iterations:salt:hash
     *
     * @param password the password to hash
     * @return a salted PBKDF2 hash of the password
     */
    public static String createHash(String password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        return createHash(password.toCharArray());
    }

    /**
     * 返回一个加密后的HASH值 <br/>
     * 格式如下<br/>
     * iterations:salt:hash
     *
     * @param password the password to hash
     * @return a salted PBKDF2 hash of the password
     */
    private static String createHash(char[] password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_BYTE_SIZE];
        random.nextBytes(salt);

        byte[] hash = pbkdf2(password, salt, PBKDF2_ITERATIONS, HASH_BYTE_SIZE);

        // 将迭代次数，盐，HASH拼接成一个字符串
        return PBKDF2_ITERATIONS + ":" + new String(Hex.encode(salt)) + ":" + new String(Hex.encode(hash));
    }

    /**
     * 验证密码是否匹配
     *
     * @param password    the password to check
     * @param correctHash the hash of the valid password
     * @return true if the password is correct, false if not
     */
    public static boolean validatePassword(String password, String correctHash)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        return validatePassword(password.toCharArray(), correctHash);
    }

    /**
     * 验证密码是否匹配
     *
     * @param password    the password to check
     * @param correctHash the hash of the valid password
     * @return true if the password is correct, false if not
     */
    private static boolean validatePassword(char[] password, String correctHash)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        // 将字符串拆解得到迭代次数、盐、HASH
        String[] params = correctHash.split(":");
        int iterations = Integer.parseInt(params[ITERATION_INDEX]);
        byte[] salt = Hex.decode(params[SALT_INDEX]);
        byte[] hash = Hex.decode(params[PBKDF2_INDEX]);
        // 使用上述迭代次数、盐、密码重新计算HASH
        byte[] testHash = pbkdf2(password, salt, iterations, hash.length);
        // 比较计算得到的HASH与存储的HASH是否一致
        return slowEquals(hash, testHash);
    }

    /**
     * Compares two byte arrays in length-constant time. This comparison method
     * is used so that password hashes cannot be extracted from an on-line
     * system using a timing attack and then attacked off-line.
     *
     * @param a the first byte array
     * @param b the second byte array
     * @return true if both byte arrays are the same, false if not
     */
    private static boolean slowEquals(byte[] a, byte[] b) {
        int diff = a.length ^ b.length;
        for (int i = 0; i < a.length && i < b.length; i++) {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }

    /**
     * 根据迭代次数、盐、密码计算HASH
     *
     * @param password   the password to hash.
     * @param salt       the salt
     * @param iterations the iteration count (slowness factor)
     * @param bytes      the length of the hash to compute in bytes
     * @return the PBDKF2 hash of the password
     */
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }
}
