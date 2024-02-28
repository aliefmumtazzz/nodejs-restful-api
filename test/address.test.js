import supertest from "supertest";
import {
    createTestAddress,
    createTestContact,
    createTestUser,
    getTestAddress,
    getTestContact,
    removeAllTestAddresses,
    removeAllTestContact,
    removeTestUser
} from "./test-util";
import { web } from "../src/app/web.js";

describe('POST /api/contacts/:contactsId/addresses', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can create new address', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: 'Indonesia',
                postal_code: '123456'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('jalan test');
        expect(result.body.data.city).toBe('kota test');
        expect(result.body.data.province).toBe('provinsi test');
        expect(result.body.data.country).toBe('Indonesia');
        expect(result.body.data.postal_code).toBe('123456');
    });

    it('Should reject if address request is not valid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: '',
                postal_code: ''
            });

        expect(result.status).toBe(400);
    });

    it('Should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${testContact.id + 1}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'jalan test',
                city: 'kota test',
                province: 'provinsi test',
                country: 'Indonesia',
                postal_code: '123456'
            });

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can get address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('jalan test');
        expect(result.body.data.city).toBe('kota test');
        expect(result.body.data.province).toBe('provinsi test');
        expect(result.body.data.country).toBe('Indonesia');
        expect(result.body.data.postal_code).toBe('123456');
    });

    it('Should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('Should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can update address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '1111'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testAddress.id);
        expect(result.body.data.street).toBe('street');
        expect(result.body.data.city).toBe('city');
        expect(result.body.data.province).toBe('provinsi');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('1111');
    });

    it('Should reject if request is not valid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'provinsi',
                country: '',
                postal_code: ''
            });

        expect(result.status).toBe(400);
    });

    it('Should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '1111'
            });

        expect(result.status).toBe(404);
    });

    it('Should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'provinsi',
                country: 'indonesia',
                postal_code: '1111'
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can remove address', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('Ok');

        testAddress = await getTestAddress();
        expect(testAddress).toBeNull();
    });

    it('Should reject if address is not found', async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}/addresses/${testAddress.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('Should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id + 1}/addresses/${testAddress.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can get list address', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}/addresses`)
            .set('Authorization', 'test')

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('Should reject if contact is not valid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id + 1}/addresses`)
            .set('Authorization', 'test')

        expect(result.status).toBe(404);
    });
});