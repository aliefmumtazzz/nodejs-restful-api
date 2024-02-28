import supertest from "supertest";
import { createManyTestContacts, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util.js";
import { web } from "../src/app/web.js";

describe('POST /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can create new contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '081383837474'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('test');
        expect(result.body.data.last_name).toBe('test');
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.phone).toBe('081383837474');

    });

    it('Should reject if requrest is not valid', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: 'test',
                email: 'test@',
                phone: '081383837474213232323'
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    });
});

describe('POST /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can get contact', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });

    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can update existing contact', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'Alief',
                last_name: 'Mumtaz',
                email: 'alief@gmail.com',
                phone: '08123123123'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('Alief');
        expect(result.body.data.last_name).toBe('Mumtaz');
        expect(result.body.data.email).toBe('alief@gmail.com');
        expect(result.body.data.phone).toBe('08123123123');
    });

    it('Should reject if request is invalid', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: '',
                email: 'alief',
                phone: ''
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('Should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'Alief',
                last_name: 'Mumtaz',
                email: 'alief@gmail.com',
                phone: '08123123123'
            });

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can delete contact', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('Ok');

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });

    it('Should reject if contact is not found', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete(`/api/contacts/${testContact.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts', function () {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('Should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('Should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({ page: 2 })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('Should can search by name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({ name: 'test 1' })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('Should can search by email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({ email: 'test1@gmail.com' })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it('Should can search by phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({ phone: '08123456789' })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });
});