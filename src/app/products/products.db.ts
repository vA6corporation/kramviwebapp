import { ProductModel } from "./product.model";

export class ProductsDb {

  private db: IDBDatabase|null = null;

  loadDb(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (indexedDB) {
        const request = indexedDB.open('products', 1);
        request.onsuccess = () => {
          this.db = request.result;
          console.log('OPEN', this.db);
          resolve();
        }

        request.onupgradeneeded = (e) => {
          this.db = request.result;
          console.log('CREATE', this.db);
          if (e.oldVersion < 1) {
            this.db.createObjectStore('products', { keyPath: '_id' });
          }
        }

        request.onerror = (error) => {
          console.log('Error', error);
          reject();
        }
      } else {
        reject();
      }
    });
  }

  loadUsers() {
    if (this.db !== null) {
      const transaction = this.db.transaction(['rememberUsers'], 'readonly');
      const objectStore = transaction.objectStore('rememberUsers');
      const request = objectStore.openCursor();
      // const rememberUsers: UserModel[] = [];
      // request.onsuccess = (e: any) => {
      //   const cursor = e.target.result;
      //   if (cursor) {
      //     rememberUsers.push(cursor.value);
      //     console.log(cursor.value);
      //     cursor.continue();
      //   } else {
      //     this.rememberUsers = rememberUsers;
      //   }
      // }
    }

  update(product: ProductModel) {
    if (this.db) {
      const transaction = this.db.transaction(['products'], 'readwrite');
      const objectStore = transaction.objectStore('products');
      objectStore.put(product);
    }
  }

  delete(userId: string) {
    if (this.db) {
      const transaction = this.db.transaction(['rememberUsers'], 'readwrite');
      const objectStore = transaction.objectStore('rememberUsers');
      const request = objectStore.delete(userId);
      request.onsuccess = () => {
        this.loadUsers();
      }
    }
  }

}