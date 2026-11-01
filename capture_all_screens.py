import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

output_dir = r"d:\PAL\brewtech\doc_screenshots"
os.makedirs(output_dir, exist_ok=True)

options = Options()
options.add_argument('--headless=new')
options.add_argument('--window-size=1440,900')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')

driver = webdriver.Chrome(options=options)

try:
    # 1. Landing Page (Top)
    print("Capturing Landing Page...")
    driver.get('https://brewtech-v2.vercel.app/')
    time.sleep(3)
    driver.save_screenshot(os.path.join(output_dir, "01_landing_hero.png"))

    # Scroll down for stats and top talents
    driver.execute_script("window.scrollTo(0, 1000);")
    time.sleep(2)
    driver.save_screenshot(os.path.join(output_dir, "02_landing_talents.png"))

    # Scroll down for ecosystem and gallery
    driver.execute_script("window.scrollTo(0, 2200);")
    time.sleep(2)
    driver.save_screenshot(os.path.join(output_dir, "03_landing_gallery.png"))

    # 2. Login Page
    print("Capturing Login Page...")
    driver.get('https://brewtech-v2.vercel.app/login')
    time.sleep(2)
    driver.save_screenshot(os.path.join(output_dir, "04_login_page.png"))

    def login_and_capture(email, password, pages):
        driver.delete_all_cookies()
        driver.get('https://brewtech-v2.vercel.app/login')
        time.sleep(2)
        
        email_input = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_input.clear()
        email_input.send_keys(email)
        
        pass_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        pass_input.clear()
        pass_input.send_keys(password)
        
        btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        btn.click()
        time.sleep(4)
        
        for fname, url_path in pages:
            driver.get(f'https://brewtech-v2.vercel.app{url_path}')
            time.sleep(3)
            driver.save_screenshot(os.path.join(output_dir, fname))
            print(f"Saved: {fname}")

    # 3. Superadmin
    print("Capturing Superadmin Portal...")
    login_and_capture('superadmin@brewtech.id', 'password123', [
        ('05_superadmin_dashboard.png', '/superadmin/dashboard'),
        ('06_superadmin_schools.png', '/superadmin/schools'),
        ('07_superadmin_cafes.png', '/superadmin/cafes'),
        ('08_superadmin_modules.png', '/superadmin/modules'),
        ('09_superadmin_cms.png', '/superadmin/cms'),
        ('10_superadmin_logs.png', '/superadmin/activity-logs'),
    ])

    # 4. School Admin
    print("Capturing School Admin Portal...")
    login_and_capture('admin@slbypacmalang.sch.id', 'password123', [
        ('11_school_dashboard.png', '/school/dashboard'),
        ('12_school_users.png', '/school/users'),
        ('13_school_classes.png', '/school/classes'),
        ('14_school_reports.png', '/school/reports'),
        ('15_school_spk.png', '/school/spk-settings'),
    ])

    # 5. Cafe Admin
    print("Capturing Cafe Admin Portal...")
    login_and_capture('admin@amongrasa.com', 'password123', [
        ('16_cafe_dashboard.png', '/cafe/dashboard'),
        ('17_cafe_pos.png', '/cafe/pos'),
        ('18_cafe_products.png', '/cafe/products'),
    ])

    # 6. Instructor
    print("Capturing Instructor Portal...")
    login_and_capture('lilikkurniyatispdgr@instructor.com', 'password123', [
        ('19_instructor_dashboard.png', '/instructor/dashboard'),
        ('20_instructor_classes.png', '/instructor/my-classes'),
    ])

    # 7. Student
    print("Capturing Student Portal...")
    login_and_capture('arlandomalanesiawaran@student.com', 'password123', [
        ('21_student_dashboard.png', '/play/dashboard'),
    ])

    # 8. Parent
    print("Capturing Parent Portal...")
    login_and_capture('veronikaworabay@parent.com', 'password123', [
        ('22_parent_dashboard.png', '/parent/dashboard'),
    ])

    print("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")

finally:
    driver.quit()

